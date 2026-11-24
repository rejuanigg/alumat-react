const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

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
  hourCycle: 'h23',
});

export function formatMoneda(valor) {
  return moneda.format(Number(valor) || 0);
}

export function formatMonedaCorta(valor) {
  return monedaSinCentavos.format(Number(valor) || 0);
}

export function formatFechaHora(valor) {
  return valor ? fechaHora.format(new Date(valor)) : '—';
}

export function sumar(filas, campo) {
  return filas.reduce((total, fila) => total + Number(fila[campo]), 0);
}

// Los cobros no tienen apertura asociada salvo los de efectivo: los demás
// medios (transferencia, tarjetas) se atribuyen por la ventana de tiempo de
// la apertura. No generan movimientos, así que no afectan el efectivo.
export function cobrosNoEfectivo(cobros, apertura, cierre) {
  if (!apertura) return [];
  const desde = new Date(apertura.fecha_hora_apertura).getTime();
  const hasta = cierre ? new Date(cierre.fecha_hora_cierre).getTime() : Infinity;
  return cobros.filter((c) => {
    const t = new Date(c.fecha_cobro).getTime();
    return c.metodo_pago !== 'efectivo' && t >= desde && t <= hasta;
  });
}
