/**
 * Datos de prueba de Cajas. Siguen los nombres del diccionario de datos.
 * Cuando se conecte la API, estos datos se reemplazan por la respuesta
 * de /api/apertura-caja/, /api/movimiento-caja/ y /api/cierre-caja/.
 * "usuario" viene con el nombre para mostrarlo en la tabla.
 *
 * Hay una sola caja: no se puede abrir otra apertura mientras esta esté abierta.
 */

export const CAJA = { id_caja: 1, nombre_caja: 'Caja principal' };

/** Apertura en curso. null = la caja está cerrada. */
export const APERTURA_ACTUAL = {
  id_apertura: 27,
  id_caja: 1,
  usuario: 'Romina Flores',
  fecha_apertura: '2026-11-13T08:05:00',
  monto_inicial: '20000.00',
};

/** Movimientos de la apertura en curso. */
export const MOVIMIENTOS = [
  {
    id_movimiento: 101,
    id_apertura: 27,
    usuario: 'Romina Flores',
    fecha_movimiento: '2026-11-13T09:20:00',
    tipo_movimiento: 'entrada',
    concepto: 'Cobro venta V-0012',
    monto: '190000.00',
    numero_boleta: 'B-1043',
  },
  {
    id_movimiento: 102,
    id_apertura: 27,
    usuario: 'Romina Flores',
    fecha_movimiento: '2026-11-13T10:05:00',
    tipo_movimiento: 'salida',
    concepto: 'Pago de flete',
    monto: '24340.00',
    numero_boleta: null,
  },
  {
    id_movimiento: 103,
    id_apertura: 27,
    usuario: 'Romina Flores',
    fecha_movimiento: '2026-11-13T11:40:00',
    tipo_movimiento: 'entrada',
    concepto: 'Cobro venta V-0008',
    monto: '47500.00',
    numero_boleta: 'B-1044',
  },
  {
    id_movimiento: 104,
    id_apertura: 27,
    usuario: 'Romina Flores',
    fecha_movimiento: '2026-11-13T12:15:00',
    tipo_movimiento: 'salida',
    concepto: 'Compra de insumos de limpieza',
    monto: '50000.00',
    numero_boleta: null,
  },
  {
    id_movimiento: 105,
    id_apertura: 27,
    usuario: 'Romina Flores',
    fecha_movimiento: '2026-11-13T17:30:00',
    tipo_movimiento: 'entrada',
    concepto: 'Cobro venta V-0011',
    monto: '82500.00',
    numero_boleta: 'B-1045',
  },
];

/**
 * Cierres anteriores.
 * saldo_esperado = monto_inicial + total_ingresos - total_egresos
 * diferencia     = monto_contado - saldo_esperado
 */
export const CIERRES = [
  {
    id_cierre: 26,
    id_apertura: 26,
    usuario: 'Romina Flores',
    fecha_cierre: '2026-11-12T20:30:00',
    monto_inicial: '20000.00',
    total_ingresos: '410000.00',
    total_egresos: '35000.00',
    monto_contado: '395000.00',
  },
  {
    id_cierre: 25,
    id_apertura: 25,
    usuario: 'Matías Zalazar',
    fecha_cierre: '2026-11-11T20:35:00',
    monto_inicial: '20000.00',
    total_ingresos: '280000.00',
    total_egresos: '60000.00',
    monto_contado: '238500.00',
  },
  {
    id_cierre: 24,
    id_apertura: 24,
    usuario: 'Romina Flores',
    fecha_cierre: '2026-11-10T20:30:00',
    monto_inicial: '15000.00',
    total_ingresos: '190000.00',
    total_egresos: '20000.00',
    monto_contado: '185000.00',
  },
  {
    id_cierre: 23,
    id_apertura: 23,
    usuario: 'Romina Flores',
    fecha_cierre: '2026-11-08T13:10:00',
    monto_inicial: '15000.00',
    total_ingresos: '95000.00',
    total_egresos: '10000.00',
    monto_contado: '100500.00',
  },
  {
    id_cierre: 22,
    id_apertura: 22,
    usuario: 'Matías Zalazar',
    fecha_cierre: '2026-11-07T20:30:00',
    monto_inicial: '20000.00',
    total_ingresos: '350000.00',
    total_egresos: '45000.00',
    monto_contado: '325000.00',
  },
  {
    id_cierre: 21,
    id_apertura: 21,
    usuario: 'Romina Flores',
    fecha_cierre: '2026-11-06T20:30:00',
    monto_inicial: '20000.00',
    total_ingresos: '265000.00',
    total_egresos: '30000.00',
    monto_contado: '255000.00',
  },
  {
    id_cierre: 20,
    id_apertura: 20,
    usuario: 'Matías Zalazar',
    fecha_cierre: '2026-11-05T20:40:00',
    monto_inicial: '15000.00',
    total_ingresos: '120000.00',
    total_egresos: '12000.00',
    monto_contado: '123000.00',
  },
];
