import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CircleCheck, ClipboardList, Clock, Hammer, Plus } from 'lucide-react';
import {
  Button,
  DataTable,
  FilterBar,
  PageHeader,
  Pagination,
  RowActions,
  StatCard,
  StatusTag,
} from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import { listarClientes, nombreCliente } from '../Clientes/clientes.api.js';
import { formatFechaHora } from '../Cajas/formatos.js';
import {
  ESTADOS_PEDIDO,
  etiquetaEstado,
  listarPedidos,
} from './pedidos.api.js';
import styles from '../Listado.module.css';

const POR_PAGINA = 8;

/** Pantalla "Pedidos". Datos de /api/pedidos/ y /api/clientes/. */
export default function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [peds, clis] = await Promise.all([
        listarPedidos(),
        listarClientes(),
      ]);
      setPedidos(peds);
      setClientes(clis);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cliente = useMemo(
    () =>
      Object.fromEntries(clientes.map((c) => [c.id_cliente, nombreCliente(c)])),
    [clientes],
  );

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return pedidos.filter(
      (p) =>
        (!estado || p.estado === estado) &&
        (!texto ||
          String(p.id_pedido).includes(texto) ||
          (cliente[p.id_cliente] ?? '').toLowerCase().includes(texto) ||
          p.observaciones.toLowerCase().includes(texto)),
    );
  }, [pedidos, busqueda, estado, cliente]);

  const cuenta = (e) => pedidos.filter((p) => p.estado === e).length;

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

  const columnas = [
    { key: 'id_pedido', label: '#' },
    {
      key: 'id_cliente',
      label: 'Cliente',
      render: (valor) => cliente[valor] ?? `Cliente #${valor}`,
    },
    {
      key: 'fecha_pedido',
      label: 'Fecha',
      render: (valor) => formatFechaHora(valor),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (valor) => <StatusTag status={etiquetaEstado(valor)} />,
    },
    {
      key: 'observaciones',
      label: 'Observaciones',
      render: (valor) => valor || '—',
    },
  ];

  const hayFiltros = busqueda.trim() !== '' || estado !== '';
  let mensajeVacio = 'Todavía no hay pedidos cargados.';
  if (cargando) mensajeVacio = 'Cargando pedidos...';
  else if (error)
    mensajeVacio = <MensajeError error={error} onRetry={cargar} />;
  else if (hayFiltros) mensajeVacio = 'No hay pedidos con esos filtros.';

  const indicador = (valor) => (cargando || error ? '—' : valor);

  return (
    <>
      <PageHeader
        title="Pedidos"
        subtitle="Consultá y administrá los pedidos de los clientes."
        icon={<ClipboardList />}
        actions={
          <Button icon={<Plus />} onClick={() => navigate('/pedidos/nuevo')}>
            Nuevo pedido
          </Button>
        }
      />

      <section
        className={styles.page}
        aria-label="Listado de pedidos"
        aria-busy={cargando}
      >
        <FilterBar
          searchValue={busqueda}
          onSearchChange={cambiarFiltro(setBusqueda)}
          searchLabel="Buscar pedidos"
          searchPlaceholder="Número, cliente u observaciones"
          filters={[
            {
              name: 'estado',
              label: 'Estado',
              value: estado,
              options: ESTADOS_PEDIDO,
              placeholder: 'Todos',
              onChange: cambiarFiltro(setEstado),
            },
          ]}
          onClear={limpiar}
          disabled={cargando || Boolean(error)}
        />

        <div className={styles.stats}>
          <StatCard
            title="Total de pedidos"
            value={indicador(pedidos.length)}
            icon={<ClipboardList />}
            variant="orders"
          />
          <StatCard
            title="Pendientes"
            value={indicador(cuenta('pendiente'))}
            icon={<Clock />}
            variant="sales"
          />
          <StatCard
            title="En proceso"
            value={indicador(cuenta('en_proceso'))}
            icon={<Hammer />}
            variant="clients"
          />
          <StatCard
            title="Finalizados"
            value={indicador(cuenta('finalizado'))}
            icon={<CircleCheck />}
            variant="products"
          />
        </div>

        <DataTable
          caption="Pedidos"
          columns={columnas}
          rows={cargando || error ? [] : visibles}
          rowKey="id_pedido"
          emptyMessage={mensajeVacio}
          renderActions={(fila) => (
            <RowActions
              itemName={`pedido #${fila.id_pedido}`}
              onView={() => navigate(`/pedidos/${fila.id_pedido}`)}
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
