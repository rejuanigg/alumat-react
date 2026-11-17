/**
 * Sesión con el backend Django.
 *
 * El backend todavía no tiene login en JSON (ver docs/API_FRONTEND.md,
 * sección 6), así que se usa su formulario /cuentas/ingresar/ por debajo:
 * - Login correcto: Django responde 302 (redirección) y deja la cookie
 *   sessionid. Con `redirect: 'manual'`, fetch lo ve como 'opaqueredirect'.
 * - Login incorrecto: responde 200 con el formulario y el mensaje de error.
 * - 5 intentos fallidos: responde 429 (bloqueo de django-axes).
 * Cuando exista POST /api/sesion/, solo cambia este archivo.
 */

const URL_INGRESAR = '/cuentas/ingresar/';
const URL_SALIR = '/cuentas/salir/';

function leerCookie(nombre) {
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${nombre}=`))
    ?.split('=')[1];
}

async function pedir(url, opciones = {}) {
  try {
    return await fetch(url, {
      credentials: 'same-origin',
      redirect: 'manual',
      ...opciones,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }
}

/**
 * Indica si hay una sesión abierta. La página de login de Django redirige
 * a quien ya inició sesión; si no, devuelve el formulario y deja la cookie
 * csrftoken que se necesita para ingresar.
 */
export async function verificarSesion() {
  const respuesta = await pedir(URL_INGRESAR);
  return respuesta.type === 'opaqueredirect';
}

/** Extrae el mensaje de error del HTML del formulario de Django. */
function errorDelFormulario(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const texto = doc.querySelector('.error')?.textContent.trim();
  return texto || 'No pudimos iniciar sesión. Revisá tus datos.';
}

/** Inicia sesión. Lanza un Error con el mensaje para mostrar si falla. */
export async function iniciarSesion(usuario, clave) {
  // Asegura la cookie csrftoken antes de enviar el formulario.
  if (!leerCookie('csrftoken') && (await verificarSesion())) return;

  const token = leerCookie('csrftoken') ?? '';
  const respuesta = await pedir(URL_INGRESAR, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      username: usuario,
      password: clave,
      csrfmiddlewaretoken: token,
    }),
  });

  if (respuesta.type === 'opaqueredirect') return;
  if (respuesta.status === 429) {
    throw new Error(
      'Demasiados intentos de ingreso. Esperá 15 minutos antes de volver a intentar con ese usuario.',
    );
  }
  if (respuesta.status === 403) {
    throw new Error(
      'El servidor rechazó el pedido (CSRF). Revisá DJANGO_CSRF_TRUSTED_ORIGINS en el .env del backend.',
    );
  }
  if (respuesta.status === 200) {
    throw new Error(errorDelFormulario(await respuesta.text()));
  }
  throw new Error(`Error inesperado del servidor (${respuesta.status}).`);
}

/** Cierra la sesión (Django solo acepta POST con token CSRF). */
export async function cerrarSesion() {
  await pedir(URL_SALIR, {
    method: 'POST',
    headers: { 'X-CSRFToken': leerCookie('csrftoken') ?? '' },
  });
}
