import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, UserCheck, UserX, Users } from 'lucide-react';
import {
  Button,
  ConfirmModal,
  DataTable,
  FilterBar,
  PageHeader,
  Pagination,
  RowActions,
  StatCard,
  StatusTag,
} from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import {
  cambiarActivo,
  listarClientes,
  nombreCliente,
} from './clientes.api.js';
import styles from './Clientes.module.css';

const POR_PAGINA = 5;

// "value" es el valor de `activo` como texto, para compararlo con el Select.
const OPCIONES_ESTADO = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
];

const COLUMNAS = [
  { key: 'id_cliente', label: '#' },
  { key: 'nombre', label: 'Nombre', render: (_, fila) => nombreCliente(fila) },
  { key: 'telefono', label: 'Teléfono', render: (valor) => valor || '—' },
  {
    key: 'correo_electronico',
    label: 'Correo',
    render: (valor) => valor || '—',
  },
  { key: 'direccion', label: 'Dirección', render: (valor) => valor || '—' },
  {
    key: 'activo',
    label: 'Estado',
    render: (valor) => <StatusTag status={valor ? 'Activo' : 'Inactivo'} />,
  },
];

// Campos en los que busca el SearchBar.
const CAMPOS_BUSQUEDA = [
  'nombre',
  'apellido',
  'razon_social',
  'dni',
  'cuit',
  'telefono',
  'correo_electronico',
  'direccion',
];

/** Pantalla "Gestión de clientes". Datos de /api/clientes/. */
export default function Clientes() {
  const navigate = useNavigate();

  // 1. Datos, carga y error.
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // 2. Filtros, página y baja.
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [aDesactivar, setADesactivar] = useState(null);
  const [desactivando, setDesactivando] = useState(false);
  const [errorBaja, setErrorBaja] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setClientes(await listarClientes());
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // 3. Filtrado.
  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return clientes.filter(
      (c) =>
        (!estado || String(c.activo) === estado) &&
        (!texto ||
          nombreCliente(c).toLowerCase().includes(texto) ||
          CAMPOS_BUSQUEDA.some((campo) =>
            String(c[campo] ?? '')
              .toLowerCase()
              .includes(texto),
          )),
    );
  }, [clientes, busqueda, estado]);

  // 4. Indicadores: sobre el total de clientes, no sobre lo filtrado.
  const activos = clientes.filter((c) => c.activo).length;
  const inactivos = clientes.length - activos;

  // 5. Paginación. Si la última página queda vacía, se retrocede.
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  const cambiarFiltro = (setter) => (evento) => {
    setter(evento.target.value);
    setPagina(1);
  };

  const limpiar = () => {
    setBusqueda('');
    setEstado('');
    setPagina(1);
  };

  // El backend no borra clientes: los da de baja (activo = false).
  const confirmarBaja = async () => {
    setDesactivando(true);
    setErrorBaja(null);
    try {
      const actualizado = await cambiarActivo(aDesactivar.id_cliente, false);
      setClientes((lista) =>
        lista.map((c) =>
          c.id_cliente === actualizado.id_cliente ? actualizado : c,
        ),
      );
      setADesactivar(null);
    } catch (e) {
      setErrorBaja(e.message);
    } finally {
      setDesactivando(false);
    }
  };

  const cancelarBaja = () => {
    setADesactivar(null);
    setErrorBaja(null);
  };

  const editarCliente = (cliente) =>
    navigate(`/clientes/${cliente.id_cliente}/editar`);

  const hayFiltros = busqueda.trim() !== '' || estado !== '';
  let mensajeVacio = 'Todavía no hay clientes cargados.';
  if (cargando) mensajeVacio = 'Cargando clientes...';
  else if (error)
    mensajeVacio = <MensajeError error={error} onRetry={cargar} />;
  else if (hayFiltros) mensajeVacio = 'No hay clientes con esos filtros.';

  const indicador = (valor) => (cargando || error ? '—' : valor);

  return (
    <>
      <PageHeader
        title="Gestión de clientes"
        subtitle="Consultá, buscá y administrá los clientes registrados."
        icon={<Users />}
        actions={
          <Button icon={<Plus />} onClick={() => navigate('/clientes/nuevo')}>
            Nuevo cliente
          </Button>
        }
      />

      <section
        className={styles.page}
        aria-label="Listado de clientes"
        aria-busy={cargando}
      >
        <FilterBar
          searchValue={busqueda}
          onSearchChange={cambiarFiltro(setBusqueda)}
          searchLabel="Buscar clientes"
          searchPlaceholder="Nombre, teléfono, correo o dirección"
          filters={[
            {
              name: 'estado',
              label: 'Estado',
              value: estado,
              options: OPCIONES_ESTADO,
              placeholder: 'Todos',
              onChange: cambiarFiltro(setEstado),
            },
          ]}
          onClear={limpiar}
          disabled={cargando || Boolean(error)}
        />

        <div className={styles.stats}>
          <StatCard
            title="Total de clientes"
            value={indicador(clientes.length)}
            icon={<Users />}
            variant="clients"
          />
          <StatCard
            title="Clientes activos"
            value={indicador(activos)}
            icon={<UserCheck />}
            variant="orders"
          />
          <StatCard
            title="Clientes inactivos"
            value={indicador(inactivos)}
            icon={<UserX />}
            variant="sales"
          />
        </div>

        <DataTable
          caption="Clientes"
          columns={COLUMNAS}
          rows={cargando || error ? [] : visibles}
          rowKey="id_cliente"
          emptyMessage={mensajeVacio}
          renderActions={(fila) => (
            <RowActions
              itemName={nombreCliente(fila)}
              onEdit={() => editarCliente(fila)}
              // Solo se puede dar de baja a un cliente activo.
              onDelete={fila.activo ? () => setADesactivar(fila) : undefined}
            />
          )}
        />

        <Pagination
          page={paginaActual}
          pageSize={POR_PAGINA}
          total={filtrados.length}
          onPageChange={setPagina}
          disabled={cargando}
        />
      </section>

      <ConfirmModal
        open={aDesactivar !== null}
        title="Dar de baja cliente"
        message={
          aDesactivar
            ? errorBaja ||
              `¿Querés dar de baja a ${nombreCliente(aDesactivar)}? Quedará inactivo y se conservan sus pedidos.`
            : ''
        }
        confirmLabel="Dar de baja"
        onConfirm={confirmarBaja}
        onCancel={cancelarBaja}
        busy={desactivando}
      />
    </>
  );
}

/** Mensaje de error dentro de la tabla, con reintento o enlace al login. */
function MensajeError({ error, onRetry }) {
  return (
    <span className={styles.error} role="alert">
      {error.message}
      {error.status === 403 ? (
        <a href={URL_LOGIN}>Iniciar sesión</a>
      ) : (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </span>
  );
}
