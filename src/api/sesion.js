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

export async function verificarSesion() {
  const respuesta = await pedir(URL_INGRESAR);
  return respuesta.type === 'opaqueredirect';
}

function errorDelFormulario(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const texto = doc.querySelector('.error')?.textContent.trim();
  return texto || 'No pudimos iniciar sesión. Revisá tus datos.';
}

export async function iniciarSesion(usuario, clave) {
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

export async function cerrarSesion() {
  await pedir(URL_SALIR, {
    method: 'POST',
    headers: { 'X-CSRFToken': leerCookie('csrftoken') ?? '' },
  });
}

const URL_REGISTRARSE = '/cuentas/registrarse/';

export async function solicitarAcceso(datos) {
  if (!leerCookie('csrftoken')) await pedir(URL_REGISTRARSE);

  const respuesta = await pedir(URL_REGISTRARSE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      ...datos,
      csrfmiddlewaretoken: leerCookie('csrftoken') ?? '',
    }),
  });

  if (respuesta.type === 'opaqueredirect') return;
  if (respuesta.status === 403) {
    throw new Error(
      'El servidor rechazó el pedido (CSRF). Revisá DJANGO_CSRF_TRUSTED_ORIGINS en el .env del backend.',
    );
  }
  if (respuesta.status === 200) {
    const doc = new DOMParser().parseFromString(
      await respuesta.text(),
      'text/html',
    );
    const errores = {};
    for (const campo of Object.keys(datos)) {
      const texto = [...doc.querySelectorAll(`#id_${campo}_error li`)]
        .map((li) => li.textContent.trim())
        .join(' ');
      if (texto) errores[campo] = texto;
    }
    const error = new Error('Revisá los datos marcados.');
    error.errores = errores;
    throw error;
  }
  throw new Error(`Error inesperado del servidor (${respuesta.status}).`);
}

export async function obtenerPerfil() {
  const respuesta = await pedir('/api/me/', {
    headers: { Accept: 'application/json' },
  });
  if (!respuesta.ok) return null;
  return respuesta.json();
}
