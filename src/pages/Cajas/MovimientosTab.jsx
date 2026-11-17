import { DataTable, StatusTag } from '../../components';
import { formatFechaHora, formatMonedaCorta } from './formatos.js';

// Columnas de la tabla. "render" cambia cómo se muestra el valor.
const COLUMNAS = [
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
  // Sin boleta (pagos, retiros) se ve "—", lo pone DataTable.
  { key: 'numero_boleta', label: 'Boleta' },
  { key: 'monto', label: 'Monto', render: (valor) => formatMonedaCorta(valor) },
  { key: 'usuario', label: 'Usuario' },
];

/**
 * Pestaña "Movimientos del día": movimientos de la apertura en curso.
 * Los recibe ya filtrados desde la página Cajas.
 */
export default function MovimientosTab({ movimientos = [], cajaAbierta }) {
  return (
    <DataTable
      caption="Movimientos del día"
      columns={COLUMNAS}
      rows={movimientos}
      rowKey="id_movimiento"
      emptyMessage={
        cajaAbierta
          ? 'Todavía no hay movimientos en esta apertura.'
          : 'La caja está cerrada. Abrila para registrar movimientos.'
      }
    />
  );
}
