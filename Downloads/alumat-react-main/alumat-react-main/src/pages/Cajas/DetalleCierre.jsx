import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button, PageHeader, StatusTag } from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import {
  listarMovimientos,
  obtenerApertura,
  obtenerCierre,
} from './cajas.api.js';
import { formatFechaHora, formatMoneda } from './formatos.js';
import MovimientosTab from './MovimientosTab.jsx';
import formStyles from '../Clientes/ClienteForm.module.css';

/** Estado de la diferencia (contado - esperado) para el StatusTag. */
function estadoDiferencia(diferencia) {
  const n = Number(diferencia);
  if (n === 0) return 'Sin diferencia';
  return n < 0 ? 'Faltante' : 'Sobrante';
}

/** Pantalla "Detalle de cierre": /cajas/cierres/:id. */
export default function DetalleCierre() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cierre, setCierre] = useState(null);
  const [apertura, setApertura] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const c = await obtenerCierre(id);
      const [ap, movs] = await Promise.all([
        obtenerApertura(c.id_apertura),
        listarMovimientos(),
      ]);
      setCierre(c);
      setApertura(ap);
      setMovimientos(
        movs
          .filter((m) => m.id_apertura === c.id_apertura)
          .map((m) => ({ ...m, usuario: `Usuario #${m.id_usuario}` })),
      );
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const datos = cierre && [
    ['Apertura', formatFechaHora(apertura.fecha_hora_apertura)],
    ['Cierre', formatFechaHora(cierre.fecha_hora_cierre)],
    ['Usuario de cierre', `Usuario #${cierre.id_usuario}`],
    ['Monto inicial', formatMoneda(apertura.monto_inicial)],
    ['Total de ingresos', formatMoneda(cierre.total_ingresos)],
    ['Total de egresos', formatMoneda(cierre.total_egresos)],
    ['Saldo esperado', formatMoneda(cierre.saldo_esperado)],
    ['Efectivo contado', formatMoneda(cierre.efectivo_contado)],
  ];

  return (
    <>
      <PageHeader
        title={
          cierre ? `Cierre de caja #${cierre.id_cierre}` : 'Cierre de caja'
        }
        subtitle="Resumen del cierre y movimientos de la apertura."
        icon={<Lock />}
        actions={
          <Button
            variant="outline"
            icon={<ArrowLeft />}
            onClick={() => navigate('/cajas')}
          >
            Volver
          </Button>
        }
      />

      {cargando && (
        <p className={formStyles.section} aria-busy="true">
          Cargando cierre...
        </p>
      )}

      {!cargando && error && (
        <div className={formStyles.errorGeneral} role="alert">
          {error.status === 404 ? 'El cierre no existe.' : error.message}
          {error.status === 403 ? (
            <a href={URL_LOGIN}>Iniciar sesión</a>
          ) : (
            <Button variant="outline" onClick={cargar}>
              Reintentar
            </Button>
          )}
        </div>
      )}

      {!cargando && cierre && (
        <div className={formStyles.form}>
          <section className={formStyles.section} aria-labelledby="sec-resumen">
            <h2 id="sec-resumen" className={formStyles.sectionTitle}>
              Resumen
            </h2>
            <dl className={formStyles.grid}>
              {datos.map(([etiqueta, valor]) => (
                <div key={etiqueta}>
                  <dt>{etiqueta}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
              <div>
                <dt>Diferencia</dt>
                <dd>
                  {formatMoneda(cierre.diferencia)}{' '}
                  <StatusTag status={estadoDiferencia(cierre.diferencia)} />
                </dd>
              </div>
            </dl>
          </section>

          <section className={formStyles.section} aria-labelledby="sec-movs">
            <h2 id="sec-movs" className={formStyles.sectionTitle}>
              Movimientos de la apertura
            </h2>
            <MovimientosTab movimientos={movimientos} cajaAbierta={false} />
          </section>
        </div>
      )}
    </>
  );
}
