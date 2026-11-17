import { api } from '../../api/client.js';

/**
 * Endpoints de ventas y cobros (/api/ventas/, /api/cobros/). Son historial:
 * solo se registran y se consultan.
 */

export const METODOS_PAGO = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'tarjeta_debito', label: 'Tarjeta de débito' },
  { value: 'tarjeta_credito', label: 'Tarjeta de crédito' },
];

export const TIPOS_COBRO = [
  { value: 'parcial', label: 'Parcial' },
  { value: 'total', label: 'Total' },
];

export const etiquetaMetodo = (valor) =>
  METODOS_PAGO.find((m) => m.value === valor)?.label ?? valor;

export const listarVentas = () => api('GET', '/api/ventas/');

export const obtenerVenta = (id_venta) =>
  api('GET', `/api/ventas/${id_venta}/`);

/** datos: { id_pedido, importe_total } */
export const crearVenta = (datos) => api('POST', '/api/ventas/', datos);

export const listarCobros = (id_venta) =>
  api('GET', `/api/cobros/${id_venta ? `?id_venta=${id_venta}` : ''}`);

/**
 * datos: { id_venta, monto, tipo_cobro, metodo_pago, numero_boleta,
 * id_apertura }. id_apertura solo se usa si el pago es en efectivo.
 */
export const registrarCobro = (datos) => api('POST', '/api/cobros/', datos);

/** Apertura de caja en curso (para cobros en efectivo), o null. */
export const aperturaAbierta = async () =>
  (await api('GET', '/api/aperturas/?estado=abierta'))[0] ?? null;
