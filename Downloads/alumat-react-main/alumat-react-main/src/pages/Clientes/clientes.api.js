import { api } from '../../api/client.js';

/**
 * Endpoints de clientes (/api/clientes/). El backend no tiene DELETE:
 * un cliente se da de baja con PATCH { activo: false }.
 */

export const TIPOS_CLIENTE = [
  { value: 'particular', label: 'Particular' },
  { value: 'empresa', label: 'Empresa' },
];

/** Lista todos los clientes (activos e inactivos). Sin paginación. */
export const listarClientes = () => api('GET', '/api/clientes/');

export const obtenerCliente = (id_cliente) =>
  api('GET', `/api/clientes/${id_cliente}/`);

export const crearCliente = (datos) => api('POST', '/api/clientes/', datos);

/** Reemplaza todos los datos del cliente (PUT). */
export const actualizarCliente = (id_cliente, datos) =>
  api('PUT', `/api/clientes/${id_cliente}/`, datos);

export const cambiarActivo = (id_cliente, activo) =>
  api('PATCH', `/api/clientes/${id_cliente}/`, { activo });

/** Nombre para mostrar: "Nombre Apellido" o la razón social. */
export function nombreCliente(cliente) {
  return cliente.tipo_cliente === 'empresa'
    ? cliente.razon_social
    : `${cliente.nombre} ${cliente.apellido}`.trim();
}
