export function mensajesDeError(error) {
  const errores = error?.errores;
  if (!errores || typeof errores !== 'object') return error.message;
  const lista = Object.values(errores).flat().filter(Boolean);
  return lista.length ? lista.join(' ') : error.message;
}
