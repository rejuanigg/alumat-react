// Datos de prueba de la página /componentes. Van en un archivo aparte porque
// react-refresh/only-export-components no deja exportar constantes desde un .jsx.

export const BUTTON_VARIANTS = ['primary', 'outline', 'danger'];

export const ICON_BUTTON_TONES = ['neutral', 'primary', 'success', 'danger'];

export const BADGE_TONES = [
  'success',
  'danger',
  'warning',
  'info',
  'accent',
  'neutral',
];

// Todos los estados del mapa STATUS_TONES + uno desconocido (tono neutral).
export const STATUSES = [
  'Activo',
  'Inactivo',
  'Pagada',
  'Pendiente',
  'Abierta',
  'Cerrada',
  'En proceso',
  'Finalizado',
];
export const UNKNOWN_STATUS = 'Archivado';

export const LINEAS = [
  { value: 'modena', label: 'Módena' },
  { value: 'herrero', label: 'Herrero' },
  { value: 'a30', label: 'A30 New' },
  { value: 'rotonda', label: 'Rotonda 640' },
];

export const ITEM_DEMO = 'Laura Gómez';

export const FORM_INICIAL = {
  nombre: '',
  email: '',
  linea: '',
  observaciones: '',
};

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Devuelve { campo: mensaje } con los errores del formulario de ejemplo. */
export function validarFormulario(valores) {
  const errores = {};
  if (!valores.nombre.trim()) errores.nombre = 'Ingresá el nombre del cliente.';
  if (!valores.email.trim()) errores.email = 'Ingresá un correo electrónico.';
  else if (!EMAIL_VALIDO.test(valores.email))
    errores.email = 'El correo no tiene un formato válido.';
  if (!valores.linea) errores.linea = 'Elegí una línea de aberturas.';
  return errores;
}

// Orden de los campos: define cuál se enfoca primero cuando hay errores.
export const ORDEN_CAMPOS = ['nombre', 'email', 'linea', 'observaciones'];
