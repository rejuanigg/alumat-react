/**
 * Datos de prueba de Cajas. Siguen los nombres del diccionario de datos.
 * Cuando se conecte la API, estos datos se reemplazan por la respuesta
 * de /api/movimiento-caja/ y /api/cierre-caja/.
 * "caja" y "usuario" vienen con el nombre para mostrarlos en la tabla.
 */

export const CAJAS = [
  { id_caja: 1, nombre_caja: 'Caja principal' },
  { id_caja: 2, nombre_caja: 'Caja mostrador' },
];

export const MOVIMIENTOS = [
  {
    id_movimiento: 1,
    id_apertura: 10,
    caja: 'Caja principal',
    usuario: 'romina',
    fecha_movimiento: '2026-11-14T09:15:00',
    tipo_movimiento: 'entrada',
    concepto: 'Cobro boleta 0001-00000125',
    monto: '85000.00',
    numero_boleta: '0001-00000125',
  },
  {
    id_movimiento: 2,
    id_apertura: 10,
    caja: 'Caja principal',
    usuario: 'romina',
    fecha_movimiento: '2026-11-14T10:40:00',
    tipo_movimiento: 'salida',
    concepto: 'Compra de insumos de limpieza',
    monto: '6500.00',
    numero_boleta: null,
  },
  {
    id_movimiento: 3,
    id_apertura: 11,
    caja: 'Caja mostrador',
    usuario: 'kevin',
    fecha_movimiento: '2026-11-14T11:05:00',
    tipo_movimiento: 'entrada',
    concepto: 'Cobro boleta 0001-00000126',
    monto: '120000.00',
    numero_boleta: '0001-00000126',
  },
  {
    id_movimiento: 4,
    id_apertura: 10,
    caja: 'Caja principal',
    usuario: 'romina',
    fecha_movimiento: '2026-11-14T12:30:00',
    tipo_movimiento: 'salida',
    concepto: 'Pago de flete',
    monto: '18000.00',
    numero_boleta: null,
  },
  {
    id_movimiento: 5,
    id_apertura: 11,
    caja: 'Caja mostrador',
    usuario: 'kevin',
    fecha_movimiento: '2026-11-14T15:20:00',
    tipo_movimiento: 'entrada',
    concepto: 'Cobro boleta 0001-00000127',
    monto: '45500.00',
    numero_boleta: '0001-00000127',
  },
  {
    id_movimiento: 6,
    id_apertura: 12,
    caja: 'Caja principal',
    usuario: 'santino',
    fecha_movimiento: '2026-11-15T09:10:00',
    tipo_movimiento: 'entrada',
    concepto: 'Ingreso manual: cambio para el día',
    monto: '10000.00',
    numero_boleta: null,
  },
  {
    id_movimiento: 7,
    id_apertura: 12,
    caja: 'Caja principal',
    usuario: 'santino',
    fecha_movimiento: '2026-11-15T10:45:00',
    tipo_movimiento: 'entrada',
    concepto: 'Cobro boleta 0001-00000128',
    monto: '230000.00',
    numero_boleta: '0001-00000128',
  },
  {
    id_movimiento: 8,
    id_apertura: 12,
    caja: 'Caja principal',
    usuario: 'santino',
    fecha_movimiento: '2026-11-15T13:00:00',
    tipo_movimiento: 'salida',
    concepto: 'Retiro para depósito bancario',
    monto: '150000.00',
    numero_boleta: null,
  },
];
