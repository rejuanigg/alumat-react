import { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  CircleArrowDown,
  CircleArrowUp,
  Wallet,
} from 'lucide-react';
import {
  DataTable,
  FilterBar,
  Pagination,
  RowActions,
  StatCard,
  StatusTag,
} from '../../components';
import { CAJAS, MOVIMIENTOS } from './cajas.mock.js';
import {
  formatFechaHora,
  formatMoneda,
  formatMonedaCorta,
  sumar,
} from './formatos.js';
import styles from './Cajas.module.css';

const POR_PAGINA = 5;

// Opciones de los filtros. "value" es lo que se compara; "label" lo que se ve.
const OPCIONES_CAJA = CAJAS.map((c) => ({
  value: c.nombre_caja,
  label: c.nombre_caja,
}));
const OPCIONES_TIPO = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'salida', label: 'Salida' },
];

// Columnas de la tabla. "render" cambia cómo se muestra el valor.
const COLUMNAS = [
  { key: 'id_movimiento', label: 'N.º' },
  { key: 'caja', label: 'Caja' },
  {
    key: 'fecha_movimiento',
    label: 'Fecha y hora',
    render: (valor) => formatFechaHora(valor),
  },
  {
    key: 'tipo_movimiento',
    label: 'Tipo',
    // 'entrada' -> <StatusTag status="Entrada" /> (verde)
    render: (valor) => (
      <StatusTag status={valor === 'entrada' ? 'Entrada' : 'Salida'} />
    ),
  },
  { key: 'concepto', label: 'Concepto' },
  { key: 'monto', label: 'Monto', render: (valor) => formatMoneda(valor) },
  { key: 'usuario', label: 'Usuario' },
];

/**
 * Pestaña "Movimientos" de Cajas.
 * Por ahora usa datos de prueba (cajas.mock.js).
 */
export default function MovimientosTab() {
  // 1. Estado: lo que el usuario escribe o elige.
  const [busqueda, setBusqueda] = useState('');
  const [caja, setCaja] = useState('');
  const [tipo, setTipo] = useState('');
  const [pagina, setPagina] = useState(1);

  // 2. Filtrado: se recalcula solo cuando cambia algún filtro.
  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return MOVIMIENTOS.filter(
      (m) =>
        (!caja || m.caja === caja) &&
        (!tipo || m.tipo_movimiento === tipo) &&
        (!texto ||
          m.concepto.toLowerCase().includes(texto) ||
          m.usuario.toLowerCase().includes(texto) ||
          String(m.id_movimiento) === texto),
    );
  }, [busqueda, caja, tipo]);

  // 3. Indicadores: se calculan sobre lo filtrado.
  const entradas = sumar(
    filtrados.filter((m) => m.tipo_movimiento === 'entrada'),
    'monto',
  );
  const salidas = sumar(
    filtrados.filter((m) => m.tipo_movimiento === 'salida'),
    'monto',
  );

  // 4. Paginación: se muestra solo una parte de las filas.
  const visibles = filtrados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

  // Cada vez que cambia un filtro se vuelve a la página 1.
  const cambiarFiltro = (setter) => (evento) => {
    setter(evento.target.value);
    setPagina(1);
  };

  const limpiar = () => {
    setBusqueda('');
    setCaja('');
    setTipo('');
    setPagina(1);
  };

  return (
    <section className={styles.tab} aria-label="Movimientos de caja">
      <div className={styles.stats}>
        <StatCard
          title="Movimientos"
          value={filtrados.length}
          icon={<ArrowLeftRight />}
          variant="clients"
          description="Registrados con los filtros actuales"
        />
        <StatCard
          title="Entradas"
          value={formatMonedaCorta(entradas)}
          icon={<CircleArrowDown />}
          variant="orders"
          description="Cobros en efectivo e ingresos"
        />
        <StatCard
          title="Salidas"
          value={formatMonedaCorta(salidas)}
          icon={<CircleArrowUp />}
          variant="sales"
          description="Egresos de efectivo"
        />
        <StatCard
          title="Saldo"
          value={formatMonedaCorta(entradas - salidas)}
          icon={<Wallet />}
          variant="products"
          description="Entradas menos salidas"
        />
      </div>

      <FilterBar
        searchValue={busqueda}
        onSearchChange={cambiarFiltro(setBusqueda)}
        searchLabel="Buscar movimientos"
        searchPlaceholder="Concepto o usuario"
        filters={[
          {
            name: 'caja',
            label: 'Caja',
            value: caja,
            options: OPCIONES_CAJA,
            placeholder: 'Todas',
            onChange: cambiarFiltro(setCaja),
          },
          {
            name: 'tipo',
            label: 'Tipo',
            value: tipo,
            options: OPCIONES_TIPO,
            placeholder: 'Todos',
            onChange: cambiarFiltro(setTipo),
          },
        ]}
        onClear={limpiar}
      />

      <DataTable
        caption="Movimientos de caja"
        columns={COLUMNAS}
        rows={visibles}
        rowKey="id_movimiento"
        emptyMessage="No hay movimientos con esos filtros."
        // Solo "Ver": un movimiento no se edita ni se borra (queda en el arqueo).
        renderActions={(fila) => (
          <RowActions
            itemName={`movimiento ${fila.id_movimiento}`}
            onView={() => alert(`Movimiento ${fila.id_movimiento}`)}
          />
        )}
      />

      <Pagination
        page={pagina}
        pageSize={POR_PAGINA}
        total={filtrados.length}
        onPageChange={setPagina}
      />
    </section>
  );
}
