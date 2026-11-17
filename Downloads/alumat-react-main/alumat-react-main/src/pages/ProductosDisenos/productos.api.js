import { api } from '../../api/client.js';

/**
 * Endpoints de productos y diseños (/api/productos/, /api/disenos/).
 * No hay DELETE: se da de baja con PATCH { activo: false } y se reactiva
 * con { activo: true }. Los listados sin filtro traen activos e inactivos.
 */

/** Lista productos. `filtros` admite { activo, tipo_abertura, q }. */
export const listarProductos = (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  return api('GET', `/api/productos/${params ? `?${params}` : ''}`);
};

export const cambiarActivoProducto = (id_producto, activo) =>
  api('PATCH', `/api/productos/${id_producto}/`, { activo });

/** Lista diseños. `filtros` admite { id_producto, activo }. */
export const listarDisenos = (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  return api('GET', `/api/disenos/${params ? `?${params}` : ''}`);
};

/** datos: { id_producto, nombre_diseno, activo } */
export const crearDiseno = (datos) => api('POST', '/api/disenos/', datos);

export const obtenerProducto = (id_producto) =>
  api('GET', `/api/productos/${id_producto}/`);

/** datos: { nombre, tipo_abertura, descripcion, activo } */
export const crearProducto = (datos) => api('POST', '/api/productos/', datos);

export const actualizarProducto = (id_producto, datos) =>
  api('PUT', `/api/productos/${id_producto}/`, datos);

/** Solo se puede cambiar el nombre: el producto no se puede reasignar. */
export const renombrarDiseno = (id_diseno, nombre_diseno) =>
  api('PATCH', `/api/disenos/${id_diseno}/`, { nombre_diseno });

export const cambiarActivoDiseno = (id_diseno, activo) =>
  api('PATCH', `/api/disenos/${id_diseno}/`, { activo });
