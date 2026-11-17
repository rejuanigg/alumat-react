/* Datos de prueba: reemplazar por llamadas a la API de Django. */

export const PRODUCTOS = [
  { id_producto: 1, nombre: 'Ventana corrediza', activo: true },
  { id_producto: 2, nombre: 'Puerta batiente', activo: true },
  { id_producto: 3, nombre: 'Paño fijo', activo: true },
];

export const DISENOS = [
  { id_diseno: 1, id_producto: 1, nombre: 'Corrediza dos hojas', activo: true },
  {
    id_diseno: 2,
    id_producto: 1,
    nombre: 'Corrediza tres hojas',
    activo: true,
  },
  {
    id_diseno: 3,
    id_producto: 1,
    nombre: 'Corrediza con paño fijo',
    activo: true,
  },
];
