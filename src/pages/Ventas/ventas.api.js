import { api } from '../../api/client.js';

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

export const crearVenta = (datos) => api('POST', '/api/ventas/', datos);

export const listarCobros = (id_venta) =>
  api('GET', `/api/cobros/${id_venta ? `?id_venta=${id_venta}` : ''}`);

export const registrarCobro = (datos) => api('POST', '/api/cobros/', datos);

export const aperturaAbierta = async () =>
  (await api('GET', '/api/aperturas/?estado=abierta'))[0] ?? null;
