import { DataTable, StatusTag } from '../../components';
import { formatFechaHora, formatMonedaCorta } from './formatos.js';

const COLUMNAS = [
  {
    key: 'fecha_movimiento',
    label: 'Fecha y hora',
    render: (valor) => formatFechaHora(valor),
  },
  {
    key: 'tipo_movimiento',
    label: 'Tipo',

    render: (valor) => (
      <StatusTag status={valor === 'entrada' ? 'Entrada' : 'Salida'} />
    ),
  },
  { key: 'concepto', label: 'Concepto' },

  {
    key: 'id_cobro',
    label: 'Cobro',
    render: (valor) => (valor ? `#${valor}` : '—'),
  },
  { key: 'monto', label: 'Monto', render: (valor) => formatMonedaCorta(valor) },
  { key: 'usuario', label: 'Usuario' },
];

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
