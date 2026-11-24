import { DataTable } from '../../components';
import { etiquetaMetodo } from '../Ventas/ventas.api.js';
import { formatFechaHora, formatMonedaCorta, sumar } from './formatos.js';
import styles from './Cajas.module.css';

const COLUMNAS = [
  {
    key: 'fecha_cobro',
    label: 'Fecha y hora',
    render: (valor) => formatFechaHora(valor),
  },
  { key: 'numero_boleta', label: 'Boleta' },
  {
    key: 'metodo_pago',
    label: 'Medio de pago',
    render: (valor) => etiquetaMetodo(valor),
  },
  { key: 'id_venta', label: 'Venta', render: (valor) => `#${valor}` },
  { key: 'monto', label: 'Monto', render: (valor) => formatMonedaCorta(valor) },
  { key: 'usuario', label: 'Usuario' },
];

export default function CobrosNoEfectivoTab({ cobros = [], cajaAbierta }) {
  const filas = cobros.map((c) => ({
    ...c,
    usuario: `Usuario #${c.id_usuario}`,
  }));
  const porMedio = Object.entries(
    filas.reduce((acc, c) => {
      acc[c.metodo_pago] = (acc[c.metodo_pago] ?? 0) + Number(c.monto);
      return acc;
    }, {}),
  );

  return (
    <section className={styles.tab} aria-label="Cobros no efectivo">
      {porMedio.length > 0 && (
        <p className={styles.estado}>
          {porMedio.map(([medio, total]) => (
            <span key={medio}>
              {etiquetaMetodo(medio)}: <strong>{formatMonedaCorta(total)}</strong>
            </span>
          ))}
        </p>
      )}
      <DataTable
        caption="Cobros por transferencia o tarjeta"
        columns={COLUMNAS}
        rows={filas}
        rowKey="id_cobro"
        emptyMessage={
          cajaAbierta === false
            ? 'No hubo cobros por transferencia o tarjeta en esta apertura.'
            : 'Todavía no hay cobros por transferencia o tarjeta en esta apertura.'
        }
      />
      <p className={styles.aviso}>
        Estos cobros no ingresan al efectivo: no suman al saldo esperado ni al
        cierre de caja. Total: {formatMonedaCorta(sumar(filas, 'monto'))}.
      </p>
    </section>
  );
}
