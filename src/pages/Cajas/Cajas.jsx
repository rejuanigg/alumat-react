import { useCallback, useEffect, useMemo, useState } from 'react';
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
  FormField,
  Input,
  PageHeader,
  Select,
  StatCard,
  StatusTag,
  Tabs,
} from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import {
  abrirCaja as apiAbrirCaja,
  cerrarApertura,
  crearCaja,
  listarAperturas,
  listarCajas,
  listarCierres,
  listarMovimientos,
  mensajesDeError,
  registrarMovimiento as apiRegistrarMovimiento,
} from './cajas.api.js';
import ModalFormulario from './ModalFormulario.jsx';
import { formatFechaHora, formatMonedaCorta, sumar } from './formatos.js';
import MovimientosTab from './MovimientosTab.jsx';
import CierresTab from './CierresTab.jsx';
import styles from './Cajas.module.css';

const SUBTITULOS = {
  movimientos: 'Apertura, movimientos de efectivo y cierre de caja',
  cierres: 'Consulta de los cierres de caja anteriores',
};

const OPCIONES_TIPO = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'salida', label: 'Salida' },
];

const MOVIMIENTO_INICIAL = {
  tipo_movimiento: 'entrada',
  concepto: '',
  monto: '',
};

/** El backend solo manda id_usuario (no hay endpoint de usuarios). */
const nombreUsuario = (id) => `Usuario #${id}`;

/**
 * Pantalla "Caja diaria".
 * Hay una sola caja: mientras haya una apertura en curso no se puede abrir otra.
 * Datos de /api/cajas/, /api/aperturas/, /api/movimiento-caja/ y
 * /api/cierre-caja/.
 */
export default function Cajas() {
  // 1. Datos del servidor, carga y error.
  const [caja, setCaja] = useState(null);
  const [aperturas, setAperturas] = useState([]);
  const [todosMovimientos, setTodosMovimientos] = useState([]);
  const [todosCierres, setTodosCierres] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [pestana, setPestana] = useState('movimientos');

  // Un solo modal abierto a la vez: 'abrir' | 'movimiento' | 'cerrar' | null.
  const [modal, setModal] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [montoInicial, setMontoInicial] = useState('');
  const [movimientoForm, setMovimientoForm] = useState(MOVIMIENTO_INICIAL);
  const [efectivoContado, setEfectivoContado] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [cajas, aps, movs, cierres] = await Promise.all([
        listarCajas(),
        listarAperturas(),
        listarMovimientos(),
        listarCierres(),
      ]);
      setCaja(cajas[0] ?? null);
      setAperturas(aps);
      setTodosMovimientos(movs);
      setTodosCierres(cierres);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // 2. Apertura en curso (null = caja cerrada) y sus movimientos.
  const apertura = aperturas.find((a) => a.estado === 'abierta') ?? null;
  const cajaAbierta = apertura !== null;

  const movimientosDelDia = useMemo(
    () =>
      apertura
        ? todosMovimientos
            .filter((m) => m.id_apertura === apertura.id_apertura)
            .map((m) => ({ ...m, usuario: nombreUsuario(m.id_usuario) }))
        : [],
    [todosMovimientos, apertura],
  );

  // Cierres para la pestaña: suman el monto inicial y la fecha de su apertura.
  const cierres = useMemo(() => {
    const porId = Object.fromEntries(aperturas.map((a) => [a.id_apertura, a]));
    return todosCierres.map((c) => ({
      ...c,
      fecha_cierre: c.fecha_hora_cierre,
      monto_contado: c.efectivo_contado,
      monto_inicial: porId[c.id_apertura]?.monto_inicial ?? '0',
      usuario: nombreUsuario(c.id_usuario),
    }));
  }, [todosCierres, aperturas]);

  // 3. Indicadores de la apertura en curso.
  const montoInicialApertura = cajaAbierta ? Number(apertura.monto_inicial) : 0;
  const entradas = sumar(
    movimientosDelDia.filter((m) => m.tipo_movimiento === 'entrada'),
    'monto',
  );
  const salidas = sumar(
    movimientosDelDia.filter((m) => m.tipo_movimiento === 'salida'),
    'monto',
  );
  const saldoEsperado = montoInicialApertura + entradas - salidas;
  const indicador = (valor) => (cargando || error ? '—' : valor);

  // 4. Acciones: cada una llama a la API y vuelve a cargar los datos.
  const cerrarModal = () => {
    setModal(null);
    setErrorModal(null);
  };

  const abrirModal = (cual) => {
    setErrorModal(null);
    if (cual === 'abrir') setMontoInicial('');
    if (cual === 'movimiento') setMovimientoForm(MOVIMIENTO_INICIAL);
    if (cual === 'cerrar') setEfectivoContado('');
    setModal(cual);
  };

  const enviar = async (accion) => {
    setEnviando(true);
    setErrorModal(null);
    try {
      await accion();
      await cargar();
      cerrarModal();
    } catch (e) {
      setErrorModal(mensajesDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  const abrirCaja = () => {
    if (montoInicial === '' || Number(montoInicial) < 0) {
      setErrorModal('Ingresá un monto inicial mayor o igual a 0.');
      return;
    }
    enviar(async () => {
      // Primera vez: todavía no hay caja, se crea la caja principal.
      const cajaUsada =
        caja ?? (await crearCaja({ nombre_caja: 'Caja principal' }));
      await apiAbrirCaja({
        id_caja: cajaUsada.id_caja,
        monto_inicial: montoInicial,
      });
    });
  };

  const registrarMovimiento = () => {
    if (
      !movimientoForm.concepto.trim() ||
      !(Number(movimientoForm.monto) > 0)
    ) {
      setErrorModal('Ingresá un concepto y un monto mayor a 0.');
      return;
    }
    enviar(() =>
      apiRegistrarMovimiento({
        id_apertura: apertura.id_apertura,
        tipo_movimiento: movimientoForm.tipo_movimiento,
        concepto: movimientoForm.concepto.trim(),
        monto: movimientoForm.monto,
      }),
    );
  };

  const cerrarCaja = () => {
    if (efectivoContado === '' || Number(efectivoContado) < 0) {
      setErrorModal('Ingresá el efectivo contado (0 o más).');
      return;
    }
    enviar(() =>
      cerrarApertura({
        id_apertura: apertura.id_apertura,
        efectivo_contado: efectivoContado,
      }),
    );
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
              onClick={() => abrirModal('abrir')}
              disabled={cargando || Boolean(error) || cajaAbierta}
            >
              Abrir caja
            </Button>
            <Button
              variant="outline"
              icon={<Banknote />}
              onClick={() => abrirModal('movimiento')}
              disabled={!cajaAbierta}
            >
              Registrar movimiento
            </Button>
            <Button
              icon={<Lock />}
              onClick={() => abrirModal('cerrar')}
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
                {error ? (
                  <>
                    {error.message}{' '}
                    {error.status === 403 ? (
                      <a href={URL_LOGIN}>Iniciar sesión</a>
                    ) : (
                      <button type="button" onClick={cargar}>
                        Reintentar
                      </button>
                    )}
                  </>
                ) : cargando ? (
                  'Cargando...'
                ) : cajaAbierta ? (
                  `Apertura: ${formatFechaHora(apertura.fecha_hora_apertura)} · ` +
                  `Usuario: ${nombreUsuario(apertura.id_usuario)} · ` +
                  `Monto inicial: ${formatMonedaCorta(apertura.monto_inicial)}`
                ) : (
                  'No hay una apertura en curso.'
                )}
              </span>
            </div>

            <div className={styles.stats}>
              <StatCard
                title="Monto inicial"
                value={indicador(formatMonedaCorta(montoInicialApertura))}
                icon={<DollarSign />}
                variant="clients"
              />
              <StatCard
                title="Entradas del día"
                value={indicador(formatMonedaCorta(entradas))}
                icon={<CircleArrowDown />}
                variant="orders"
              />
              <StatCard
                title="Salidas del día"
                value={indicador(formatMonedaCorta(salidas))}
                icon={<CircleArrowUp />}
                variant="sales"
              />
              <StatCard
                title="Saldo esperado"
                value={indicador(formatMonedaCorta(saldoEsperado))}
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
              content: <CierresTab cierres={cierres} />,
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

      <ModalFormulario
        open={modal === 'abrir'}
        title="Abrir caja"
        submitLabel="Abrir caja"
        onSubmit={abrirCaja}
        onCancel={cerrarModal}
        busy={enviando}
        error={errorModal}
      >
        <FormField label="Monto inicial" required>
          {(field) => (
            <Input
              {...field}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
            />
          )}
        </FormField>
      </ModalFormulario>

      <ModalFormulario
        open={modal === 'movimiento'}
        title="Registrar movimiento"
        submitLabel="Registrar"
        onSubmit={registrarMovimiento}
        onCancel={cerrarModal}
        busy={enviando}
        error={errorModal}
      >
        <FormField label="Tipo" required>
          {(field) => (
            <Select
              {...field}
              options={OPCIONES_TIPO}
              value={movimientoForm.tipo_movimiento}
              onChange={(e) =>
                setMovimientoForm((f) => ({
                  ...f,
                  tipo_movimiento: e.target.value,
                }))
              }
            />
          )}
        </FormField>
        <FormField label="Concepto" required>
          {(field) => (
            <Input
              {...field}
              maxLength={200}
              value={movimientoForm.concepto}
              onChange={(e) =>
                setMovimientoForm((f) => ({ ...f, concepto: e.target.value }))
              }
            />
          )}
        </FormField>
        <FormField label="Monto" required>
          {(field) => (
            <Input
              {...field}
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={movimientoForm.monto}
              onChange={(e) =>
                setMovimientoForm((f) => ({ ...f, monto: e.target.value }))
              }
            />
          )}
        </FormField>
      </ModalFormulario>

      <ModalFormulario
        open={modal === 'cerrar'}
        title="Cerrar caja"
        submitLabel="Cerrar caja"
        onSubmit={cerrarCaja}
        onCancel={cerrarModal}
        busy={enviando}
        error={errorModal}
      >
        <p>
          Saldo esperado según el sistema: {formatMonedaCorta(saldoEsperado)}.
          El cierre es definitivo.
        </p>
        <FormField label="Efectivo contado" required>
          {(field) => (
            <Input
              {...field}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={efectivoContado}
              onChange={(e) => setEfectivoContado(e.target.value)}
            />
          )}
        </FormField>
      </ModalFormulario>
    </>
  );
}
