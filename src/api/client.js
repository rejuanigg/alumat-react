export const URL_LOGIN = '/login';

export class ApiError extends Error {
  constructor(status, errores) {
    super(mensajeDeError(status, errores));
    this.name = 'ApiError';
    this.status = status;
    this.errores = errores ?? {};
  }
}

function leerCookie(nombre) {
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${nombre}=`))
    ?.split('=')[1];
}

function mensajeDeError(status, errores) {
  if (status === 0) return 'No se pudo conectar con el servidor.';
  if (status === 403 && !errores?.detail?.includes('Dueño')) {
    return 'Tu sesión no está iniciada o venció. Iniciá sesión para continuar.';
  }
  if (errores?.detail) return errores.detail;
  if (errores?.non_field_errors) return errores.non_field_errors.join(' ');
  if (status === 400) return 'Revisá los datos marcados.';
  return `Error inesperado del servidor (${status}).`;
}

export async function api(metodo, url, datos) {
  const headers = { Accept: 'application/json' };
  if (datos !== undefined) headers['Content-Type'] = 'application/json';
  if (metodo !== 'GET') headers['X-CSRFToken'] = leerCookie('csrftoken') ?? '';

  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: metodo,
      credentials: 'same-origin',
      headers,
      body: datos !== undefined ? JSON.stringify(datos) : undefined,
    });
  } catch {
    throw new ApiError(0);
  }

  const esJson = respuesta.headers
    .get('Content-Type')
    ?.includes('application/json');
  const cuerpo =
    respuesta.status === 204 || !esJson ? null : await respuesta.json();

  if (!respuesta.ok) throw new ApiError(respuesta.status, cuerpo);
  return cuerpo;
}
