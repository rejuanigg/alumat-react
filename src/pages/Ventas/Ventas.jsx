import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Banknote,
  CircleDollarSign,
  Plus,
  Receipt,
  Wallet,
} from 'lucide-react';
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
import { listarPedidos } from '../Pedidos/pedidos.api.js';
import { formatFechaHora, formatMoneda, sumar } from '../Cajas/formatos.js';
import { listarVentas } from './ventas.api.js';
import styles from '../Listado.module.css';

const POR_PAGINA = 8;

const OPCIONES_ESTADO = [
  { value: 'saldada', label: 'Pagada' },
  { value: 'con_saldo', label: 'Con saldo' },
];

const saldada = (venta) => Number(venta.saldo_pendiente) === 0;

export default function Ventas() {
  const navigate = useNavigate();

  const [ventas, setVentas] = useState([]);
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
      const [vs, ps, cs] = await Promise.all([
        listarVentas(),
        listarPedidos(),
        listarClientes(),
      ]);
      setVentas(vs);
      setPedidos(ps);
      setClientes(cs);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const nombreDe = useMemo(() => {
    const cliente = Object.fromEntries(
      clientes.map((c) => [c.id_cliente, nombreCliente(c)]),
    );
    return Object.fromEntries(
      pedidos.map((p) => [p.id_pedido, cliente[p.id_cliente] ?? '—']),
    );
  }, [pedidos, clientes]);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return ventas.filter(
      (v) =>
        (!estado || (estado === 'saldada') === saldada(v)) &&
        (!texto ||
          String(v.id_venta).includes(texto) ||
          String(v.id_pedido).includes(texto) ||
          (nombreDe[v.id_pedido] ?? '').toLowerCase().includes(texto)),
    );
  }, [ventas, busqueda, estado, nombreDe]);

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
    { key: 'id_venta', label: '#' },
    {
      key: 'id_pedido',
      label: 'Pedido',
      render: (valor) => `#${valor}`,
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, fila) => nombreDe[fila.id_pedido] ?? '—',
    },
    {
      key: 'fecha_venta',
      label: 'Fecha',
      render: (valor) => formatFechaHora(valor),
    },
    {
      key: 'importe_total',
      label: 'Importe',
      render: (valor) => formatMoneda(valor),
    },
    {
      key: 'total_cobrado',
      label: 'Cobrado',
      render: (valor) => formatMoneda(valor),
    },
    {
      key: 'saldo_pendiente',
      label: 'Saldo',
      render: (valor) => formatMoneda(valor),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, fila) => (
        <StatusTag status={saldada(fila) ? 'Pagada' : 'Con saldo'} />
      ),
    },
  ];

  const hayFiltros = busqueda.trim() !== '' || estado !== '';
  let mensajeVacio = 'Todavía no hay ventas registradas.';
  if (cargando) mensajeVacio = 'Cargando ventas...';
  else if (error)
    mensajeVacio = <MensajeError error={error} onRetry={cargar} />;
  else if (hayFiltros) mensajeVacio = 'No hay ventas con esos filtros.';

  const indicador = (valor) => (cargando || error ? '—' : valor);

  return (
    <>
      <PageHeader
        title="Ventas y cobros"
        subtitle="Registrá las ventas de los pedidos y sus cobros."
        icon={<Receipt />}
        actions={
          <Button
            icon={<Plus />}
            onClick={() => navigate('/ventas-cobros/nueva')}
          >
            Nueva venta
          </Button>
        }
      />

      <section
        className={styles.page}
        aria-label="Listado de ventas"
        aria-busy={cargando}
      >
        <FilterBar
          searchValue={busqueda}
          onSearchChange={cambiarFiltro(setBusqueda)}
          searchLabel="Buscar ventas"
          searchPlaceholder="Número de venta, de pedido o cliente"
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
            title="Ventas registradas"
            value={indicador(ventas.length)}
            icon={<Receipt />}
            variant="sales"
          />
          <StatCard
            title="Total vendido"
            value={indicador(formatMoneda(sumar(ventas, 'importe_total')))}
            icon={<CircleDollarSign />}
            variant="clients"
          />
          <StatCard
            title="Total cobrado"
            value={indicador(formatMoneda(sumar(ventas, 'total_cobrado')))}
            icon={<Banknote />}
            variant="orders"
          />
          <StatCard
            title="Saldo pendiente"
            value={indicador(formatMoneda(sumar(ventas, 'saldo_pendiente')))}
            icon={<Wallet />}
            variant="products"
          />
        </div>

        <DataTable
          caption="Ventas"
          columns={columnas}
          rows={cargando || error ? [] : visibles}
          rowKey="id_venta"
          emptyMessage={mensajeVacio}
          renderActions={(fila) => (
            <RowActions
              itemName={`venta #${fila.id_venta}`}
              onView={() => navigate(`/ventas-cobros/${fila.id_venta}`)}
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
