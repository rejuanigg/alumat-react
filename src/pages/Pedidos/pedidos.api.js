import { api } from '../../api/client.js';

export const ESTADOS_PEDIDO = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'finalizado', label: 'Finalizado' },
];

export const etiquetaEstado = (estado) =>
  ESTADOS_PEDIDO.find((e) => e.value === estado)?.label ?? estado;

export const SIGUIENTE_ESTADO = {
  pendiente: { estado: 'en_proceso', texto: 'Pasar a En proceso' },
  en_proceso: { estado: 'finalizado', texto: 'Finalizar pedido' },
  finalizado: null,
};

export const TIPOS_VIDRIO = [
  { value: 'simple_4', label: 'Simple 4 mm' },
  { value: 'dvh_4_9_4', label: 'DVH 4+9+4' },
  { value: 'laminado_3_3', label: 'Laminado 3+3' },
  { value: 'templado_8', label: 'Templado 8 mm' },
];
export const COLORES_ALUMINIO = [
  { value: 'blanco', label: 'Blanco' },
  { value: 'negro', label: 'Negro' },
  { value: 'natural', label: 'Natural' },
  { value: 'bronce', label: 'Bronce' },
];
export const TIPOS_REVESTIMIENTO = [
  { value: 'simil_madera', label: 'Símil madera' },
  { value: 'texturado', label: 'Texturado' },
];

export const etiquetaDe = (lista, valor) =>
  lista.find((o) => o.value === valor)?.label ?? (valor || '—');

export const listarPedidos = () => api('GET', '/api/pedidos/');

export const obtenerPedido = (id_pedido) =>
  api('GET', `/api/pedidos/${id_pedido}/`);

export const crearPedido = (datos) => api('POST', '/api/pedidos/', datos);

export const cambiarEstadoPedido = (id_pedido, estado) =>
  api('PATCH', `/api/pedidos/${id_pedido}/`, { estado });

export const listarDetalles = (id_pedido) =>
  api('GET', `/api/pedidos/${id_pedido}/detalles/`);

export const crearDetalle = (id_pedido, datos) =>
  api('POST', `/api/pedidos/${id_pedido}/detalles/`, datos);

export const eliminarDetalle = (id_pedido, id_detalle) =>
  api('DELETE', `/api/pedidos/${id_pedido}/detalles/${id_detalle}/`);
