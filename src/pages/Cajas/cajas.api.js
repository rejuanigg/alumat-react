import { api } from '../../api/client.js';

export const listarCajas = () => api('GET', '/api/cajas/?activa=true');

export const crearCaja = (datos) => api('POST', '/api/cajas/', datos);

export const listarAperturas = () => api('GET', '/api/aperturas/');

export const abrirCaja = (datos) => api('POST', '/api/aperturas/', datos);

export const listarMovimientos = () => api('GET', '/api/movimiento-caja/');

export const registrarMovimiento = (datos) =>
  api('POST', '/api/movimiento-caja/', datos);

export const listarCobros = () => api('GET', '/api/cobros/');

export const listarCierres = () => api('GET', '/api/cierre-caja/');

export const cerrarApertura = (datos) =>
  api('POST', '/api/cierre-caja/', datos);

export { mensajesDeError } from '../../api/errores.js';

export const obtenerCierre = (id_cierre) =>
  api('GET', `/api/cierre-caja/${id_cierre}/`);

export const obtenerApertura = (id_apertura) =>
  api('GET', `/api/aperturas/${id_apertura}/`);
