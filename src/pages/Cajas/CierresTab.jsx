import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import {
  Button,
  DataTable,
  Input,
  Pagination,
  RowActions,
  StatusTag,
} from '../../components';
import { formatFechaHora, formatMonedaCorta } from './formatos.js';
import styles from './Cajas.module.css';

const POR_PAGINA = 5;

/** Diferencia (contado - esperado) -> estado que muestra el StatusTag. */
function estadoDiferencia(diferencia) {
  if (diferencia === 0) return 'Sin diferencia';
  return diferencia < 0 ? 'Faltante' : 'Sobrante';
}

const COLUMNAS = [
  {
    key: 'fecha_cierre',
    label: 'Fecha de cierre',
    render: (valor) => formatFechaHora(valor),
  },
  { key: 'usuario', label: 'Usuario' },
  {
    key: 'monto_inicial',
    label: 'Inicial',
    render: (valor) => formatMonedaCorta(valor),
  },
  {
    key: 'total_ingresos',
    label: 'Ingresos',
    render: (valor) => formatMonedaCorta(valor),
  },
  {
    key: 'total_egresos',
    label: 'Egresos',
    render: (valor) => formatMonedaCorta(valor),
  },
  {
    key: 'saldo_esperado',
    label: 'Saldo esperado',
    render: (valor) => formatMonedaCorta(valor),
  },
  {
    key: 'monto_contado',
    label: 'Contado',
    render: (valor) => formatMonedaCorta(valor),
  },
  {
    key: 'diferencia',
    label: 'Diferencia',
    render: (valor) => <StatusTag status={estadoDiferencia(valor)} />,
  },
];

/**
 * Pestaña "Cierres anteriores".
 * Calcula saldo esperado y diferencia, filtra por fecha y pagina.
 */
export default function CierresTab({ cierres = [] }) {
  const navigate = useNavigate();
  // 1. Estado: lo que se escribe en las fechas y lo que se aplicó con "Buscar".
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [filtro, setFiltro] = useState({ desde: '', hasta: '' });
  const [pagina, setPagina] = useState(1);

  // 2. Cálculos de cada cierre.
  const conCalculos = useMemo(
    () =>
      cierres.map((c) => {
        const saldo_esperado =
          Number(c.monto_inicial) +
          Number(c.total_ingresos) -
          Number(c.total_egresos);
        return {
          ...c,
          saldo_esperado,
          diferencia: Number(c.monto_contado) - saldo_esperado,
        };
      }),
    [cierres],
  );

  // 3. Filtro por fecha (compara solo el día, "AAAA-MM-DD").
  const filtrados = conCalculos.filter((c) => {
    const dia = c.fecha_cierre.slice(0, 10);
    return (
      (!filtro.desde || dia >= filtro.desde) &&
      (!filtro.hasta || dia <= filtro.hasta)
    );
  });

  // 4. Paginación.
  const visibles = filtrados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

  const buscar = (evento) => {
    evento.preventDefault();
    setFiltro({ desde, hasta });
    setPagina(1);
  };

  const rangoInvalido = desde && hasta && desde > hasta;

  return (
    <section className={styles.tab} aria-label="Cierres anteriores">
      <form
        className={styles.filtros}
        onSubmit={buscar}
        role="search"
        aria-label="Buscar cierres por fecha"
      >
        <Input
          type="date"
          aria-label="Desde"
          value={desde}
          max={hasta || undefined}
          onChange={(e) => setDesde(e.target.value)}
        />
        <Input
          type="date"
          aria-label="Hasta"
          value={hasta}
          min={desde || undefined}
          onChange={(e) => setHasta(e.target.value)}
        />
        <Button
          type="submit"
          variant="outline"
          icon={<Search />}
          disabled={rangoInvalido}
        >
          Buscar
        </Button>
      </form>

      <DataTable
        caption="Cierres de caja anteriores"
        columns={COLUMNAS}
        rows={visibles}
        rowKey="id_cierre"
        emptyMessage="No hay cierres en ese rango de fechas."
        renderActions={(fila) => (
          <RowActions
            itemName={`cierre del ${formatFechaHora(fila.fecha_cierre)}`}
            onView={() => navigate(`/cajas/cierres/${fila.id_cierre}`)}
          />
        )}
      />

      <div className={styles.nota}>
        <p>
          Saldo esperado = monto inicial + ingresos − egresos. Diferencia =
          efectivo contado − saldo esperado.
        </p>
        <p className={styles.notaSecundaria}>
          Cada cierre queda guardado con su fecha, su usuario y la apertura
          correspondiente.
        </p>
      </div>

      <Pagination
        page={pagina}
        pageSize={POR_PAGINA}
        total={filtrados.length}
        onPageChange={setPagina}
      />
    </section>
  );
}
