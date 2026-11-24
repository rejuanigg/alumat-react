import { api } from '../../api/client.js';

export const listarProductos = (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  return api('GET', `/api/productos/${params ? `?${params}` : ''}`);
};

export const cambiarActivoProducto = (id_producto, activo) =>
  api('PATCH', `/api/productos/${id_producto}/`, { activo });

export const listarDisenos = (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  return api('GET', `/api/disenos/${params ? `?${params}` : ''}`);
};

export const crearDiseno = (datos) => api('POST', '/api/disenos/', datos);

export const obtenerProducto = (id_producto) =>
  api('GET', `/api/productos/${id_producto}/`);

export const crearProducto = (datos) => api('POST', '/api/productos/', datos);

export const actualizarProducto = (id_producto, datos) =>
  api('PUT', `/api/productos/${id_producto}/`, datos);

export const renombrarDiseno = (id_diseno, nombre_diseno) =>
  api('PATCH', `/api/disenos/${id_diseno}/`, { nombre_diseno });

export const cambiarActivoDiseno = (id_diseno, activo) =>
  api('PATCH', `/api/disenos/${id_diseno}/`, { activo });
