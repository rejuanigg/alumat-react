/**
 * Estado → tono del Badge. Para agregar un estado, sumalo acá.
 * Un estado que no esté en el mapa se muestra con tono "neutral".
 */
export const STATUS_TONES = {
  Activo: 'success',
  Inactivo: 'danger',
  Pagada: 'success',
  'Con saldo': 'warning',
  Pendiente: 'warning',
  Abierta: 'info',
  Cerrada: 'neutral',
  'En proceso': 'info',
  Finalizado: 'success',
  Entrada: 'success',
  Salida: 'danger',
  'Sin diferencia': 'success',
  Faltante: 'danger',
  Sobrante: 'info',
};
