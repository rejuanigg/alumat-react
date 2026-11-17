import { useState } from 'react';
import {
  Banknote,
  CircleArrowDown,
  CircleArrowUp,
  DollarSign,
  Lock,
  Plus,
  Receipt,
  Wallet,
} from 'lucide-react';
import {
  Button,
  ConfirmModal,
  PageHeader,
  StatCard,
  StatusTag,
  Tabs,
} from '../../components';
import { APERTURA_ACTUAL, CIERRES, MOVIMIENTOS } from './cajas.mock.js';
import { formatFechaHora, formatMonedaCorta, sumar } from './formatos.js';
import MovimientosTab from './MovimientosTab.jsx';
import CierresTab from './CierresTab.jsx';
import styles from './Cajas.module.css';

const SUBTITULOS = {
  movimientos: 'Apertura, movimientos de efectivo y cierre de caja',
  cierres: 'Consulta de los cierres de caja anteriores',
};

// TODO: pedir el monto inicial en un formulario al abrir la caja.
const MONTO_INICIAL_PRUEBA = '20000.00';

/**
 * Pantalla "Caja diaria".
 * Hay una sola caja: mientras haya una apertura en curso no se puede abrir otra.
 * Por ahora usa datos de prueba (cajas.mock.js).
 */
export default function Cajas() {
  // 1. Estado: apertura en curso (null = caja cerrada) y sus movimientos.
  const [apertura, setApertura] = useState(APERTURA_ACTUAL);
  const [movimientos, setMovimientos] = useState(MOVIMIENTOS);
  const [pestana, setPestana] = useState('movimientos');
  const [confirmarCierre, setConfirmarCierre] = useState(false);

  const cajaAbierta = apertura !== null;

  // 2. Indicadores de la apertura en curso.
  const movimientosDelDia = cajaAbierta
    ? movimientos.filter((m) => m.id_apertura === apertura.id_apertura)
    : [];
  const montoInicial = cajaAbierta ? Number(apertura.monto_inicial) : 0;
  const entradas = sumar(
    movimientosDelDia.filter((m) => m.tipo_movimiento === 'entrada'),
    'monto',
  );
  const salidas = sumar(
    movimientosDelDia.filter((m) => m.tipo_movimiento === 'salida'),
    'monto',
  );
  const saldoEsperado = montoInicial + entradas - salidas;

  // 3. Acciones de la caja.
  const abrirCaja = () => {
    // TODO: POST /api/apertura-caja/
    setApertura({
      id_apertura: Date.now(),
      id_caja: 1,
      usuario: 'Romina Flores', // TODO: usuario de la sesión
      fecha_apertura: new Date().toISOString(),
      monto_inicial: MONTO_INICIAL_PRUEBA,
    });
  };

  const registrarMovimiento = () => {
    // TODO: abrir el formulario de movimiento (POST /api/movimiento-caja/).
    alert('Formulario de movimiento pendiente.');
  };

  const cerrarCaja = () => {
    // TODO: POST /api/cierre-caja/ con el efectivo contado.
    setApertura(null);
    setMovimientos([]);
    setConfirmarCierre(false);
  };

  return (
    <>
      <PageHeader
        title="Caja diaria"
        subtitle={SUBTITULOS[pestana]}
        icon={<Wallet />}
        actions={
          <>
            <Button
              variant="outline"
              icon={<Plus />}
              onClick={abrirCaja}
              disabled={cajaAbierta}
            >
              Abrir caja
            </Button>
            <Button
              variant="outline"
              icon={<Banknote />}
              onClick={registrarMovimiento}
              disabled={!cajaAbierta}
            >
              Registrar movimiento
            </Button>
            <Button
              icon={<Lock />}
              onClick={() => setConfirmarCierre(true)}
              disabled={!cajaAbierta}
            >
              Cerrar caja
            </Button>
          </>
        }
      />

      <div className={styles.pagina}>
        {pestana === 'movimientos' && (
          <>
            <div className={styles.estado} role="status">
              <StatusTag status={cajaAbierta ? 'Abierta' : 'Cerrada'} />
              <span>
                {cajaAbierta
                  ? `Apertura: ${formatFechaHora(apertura.fecha_apertura)} · ` +
                    `Usuario: ${apertura.usuario} · ` +
                    `Monto inicial: ${formatMonedaCorta(apertura.monto_inicial)}`
                  : 'No hay una apertura en curso.'}
              </span>
            </div>

            <div className={styles.stats}>
              <StatCard
                title="Monto inicial"
                value={formatMonedaCorta(montoInicial)}
                icon={<DollarSign />}
                variant="clients"
              />
              <StatCard
                title="Entradas del día"
                value={formatMonedaCorta(entradas)}
                icon={<CircleArrowDown />}
                variant="orders"
              />
              <StatCard
                title="Salidas del día"
                value={formatMonedaCorta(salidas)}
                icon={<CircleArrowUp />}
                variant="sales"
              />
              <StatCard
                title="Saldo esperado"
                value={formatMonedaCorta(saldoEsperado)}
                icon={<Wallet />}
                variant="products"
              />
            </div>
          </>
        )}

        <Tabs
          label="Secciones de caja"
          value={pestana}
          onChange={setPestana}
          items={[
            {
              value: 'movimientos',
              label: (
                <span className={styles.tabLabel}>
                  <Receipt aria-hidden="true" /> Movimientos del día
                </span>
              ),
              content: (
                <MovimientosTab
                  movimientos={movimientosDelDia}
                  cajaAbierta={cajaAbierta}
                />
              ),
            },
            {
              value: 'cierres',
              label: (
                <span className={styles.tabLabel}>
                  <Lock aria-hidden="true" /> Cierres anteriores
                </span>
              ),
              content: <CierresTab cierres={CIERRES} />,
            },
          ]}
        />

        {pestana === 'movimientos' && (
          <p className={styles.aviso}>
            Solo hay una caja. No se puede abrir otra apertura mientras esta
            esté abierta.
          </p>
        )}
      </div>

      <ConfirmModal
        open={confirmarCierre}
        title="Cerrar caja"
        message={`Se va a cerrar la apertura en curso con un saldo esperado de ${formatMonedaCorta(saldoEsperado)}. ¿Querés continuar?`}
        confirmLabel="Cerrar caja"
        onConfirm={cerrarCaja}
        onCancel={() => setConfirmarCierre(false)}
      />
    </>
  );
}
