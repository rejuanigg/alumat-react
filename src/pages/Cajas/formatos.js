const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

// Sin centavos: para las tarjetas de indicadores, donde el espacio es chico.
const monedaSinCentavos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

const fechaHora = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23', // 15:20 en lugar de 03:20 p. m.
});

export function formatMoneda(valor) {
  return moneda.format(Number(valor) || 0);
}

/** 490500 -> "$ 490.500" (para StatCard) */
export function formatMonedaCorta(valor) {
  return monedaSinCentavos.format(Number(valor) || 0);
}

/** "2026-11-14T09:30:00" -> "14/11/2026, 09:30" */
export function formatFechaHora(valor) {
  return valor ? fechaHora.format(new Date(valor)) : '—';
}

/** Suma un campo numérico de una lista: sumar(filas, 'monto') */
export function sumar(filas, campo) {
  return filas.reduce((total, fila) => total + Number(fila[campo]), 0);
}
