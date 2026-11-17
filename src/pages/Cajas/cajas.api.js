import { api } from '../../api/client.js';

/**
 * Endpoints de cajas (/api/cajas/, /api/aperturas/, /api/movimiento-caja/,
 * /api/cierre-caja/). Las aperturas, los movimientos y los cierres no se
 * modifican ni se borran: solo se registran y se consultan.
 */

export const listarCajas = () => api('GET', '/api/cajas/?activa=true');

/** datos: { nombre_caja } */
export const crearCaja = (datos) => api('POST', '/api/cajas/', datos);

export const listarAperturas = () => api('GET', '/api/aperturas/');

/** datos: { id_caja, monto_inicial } */
export const abrirCaja = (datos) => api('POST', '/api/aperturas/', datos);

/** El backend no filtra por apertura: se filtra en el front por id_apertura. */
export const listarMovimientos = () => api('GET', '/api/movimiento-caja/');

/** datos: { id_apertura, tipo_movimiento, concepto, monto } */
export const registrarMovimiento = (datos) =>
  api('POST', '/api/movimiento-caja/', datos);

export const listarCierres = () => api('GET', '/api/cierre-caja/');

/** datos: { id_apertura, efectivo_contado } */
export const cerrarApertura = (datos) =>
  api('POST', '/api/cierre-caja/', datos);

export { mensajesDeError } from '../../api/errores.js';

export const obtenerCierre = (id_cierre) =>
  api('GET', `/api/cierre-caja/${id_cierre}/`);

export const obtenerApertura = (id_apertura) =>
  api('GET', `/api/aperturas/${id_apertura}/`);
