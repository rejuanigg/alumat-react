import { api } from '../../api/client.js';

export const TIPOS_CLIENTE = [
  { value: 'particular', label: 'Particular' },
  { value: 'empresa', label: 'Empresa' },
];

export const listarClientes = () => api('GET', '/api/clientes/');

export const obtenerCliente = (id_cliente) =>
  api('GET', `/api/clientes/${id_cliente}/`);

export const crearCliente = (datos) => api('POST', '/api/clientes/', datos);

export const actualizarCliente = (id_cliente, datos) =>
  api('PUT', `/api/clientes/${id_cliente}/`, datos);

export const cambiarActivo = (id_cliente, activo) =>
  api('PATCH', `/api/clientes/${id_cliente}/`, { activo });

export function nombreCliente(cliente) {
  return cliente.tipo_cliente === 'empresa'
    ? cliente.razon_social
    : `${cliente.nombre} ${cliente.apellido}`.trim();
}

// Opciones para <SearchSelect>: solo clientes activos, con datos para buscar.
export const opcionesClientes = (clientes) =>
  clientes
    .filter((c) => c.activo)
    .map((c) => {
      const documento = c.tipo_cliente === 'empresa' ? c.cuit : c.dni;
      const detalle = [
        documento && `${c.tipo_cliente === 'empresa' ? 'CUIT' : 'DNI'} ${documento}`,
        c.telefono,
        c.correo_electronico,
      ].filter(Boolean);
      return {
        value: String(c.id_cliente),
        label: nombreCliente(c),
        description: detalle.join(' · ') || undefined,
        filtros: { tipo_cliente: c.tipo_cliente },
      };
    });

export const FILTROS_CLIENTE = [
  { name: 'tipo_cliente', label: 'Tipo', options: TIPOS_CLIENTE },
];
