/**
 * Validaciones del formulario de cliente. Copian las reglas del backend
 * (clientes/models.py y serializers.py) para avisar antes de enviar; el
 * backend vuelve a validar y sus mensajes también se muestran.
 * Devuelven un objeto { campo: 'mensaje' } solo con los campos con error.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Dígitos, espacios, guiones, paréntesis y un "+" inicial.
const TELEFONO = /^\+?[\d\s()-]+$/;

const soloDigitos = (texto) => texto.replace(/\D/g, '');

/** Dígito verificador de CUIT/CUIL (mismo cálculo que el backend). */
export function cuitValido(cuit) {
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce(
    (total, peso, i) => total + Number(cuit[i]) * peso,
    0,
  );
  let verificador = 11 - (suma % 11);
  if (verificador === 11) verificador = 0;
  if (verificador === 10) return false;
  return verificador === Number(cuit[10]);
}

export function validarCliente(valores) {
  const errores = {};
  const v = (campo) => (valores[campo] ?? '').trim();

  if (!v('tipo_cliente')) {
    errores.tipo_cliente = 'Elegí el tipo de cliente.';
  }

  if (v('tipo_cliente') === 'particular') {
    if (!v('nombre')) errores.nombre = 'El nombre es obligatorio.';
    if (!v('apellido')) errores.apellido = 'El apellido es obligatorio.';

    const dni = v('dni');
    if (!dni) {
      errores.dni = 'El DNI es obligatorio.';
    } else if (
      !/^[\d.\s-]+$/.test(dni) ||
      !/^\d{7,8}$/.test(soloDigitos(dni))
    ) {
      errores.dni = 'El DNI debe tener 7 u 8 dígitos.';
    }
  }

  if (v('tipo_cliente') === 'empresa') {
    if (!v('razon_social')) {
      errores.razon_social = 'La razón social es obligatoria.';
    }

    const cuit = soloDigitos(v('cuit'));
    if (!v('cuit')) {
      errores.cuit = 'El CUIT es obligatorio.';
    } else if (!/^[\d.\s-]+$/.test(v('cuit')) || cuit.length !== 11) {
      errores.cuit = 'El CUIT debe tener 11 dígitos.';
    } else if (!cuitValido(cuit)) {
      errores.cuit = 'El CUIT no es válido (dígito verificador).';
    }
  }

  const telefono = v('telefono');
  if (
    telefono &&
    (!TELEFONO.test(telefono) || soloDigitos(telefono).length < 6)
  ) {
    errores.telefono =
      'Ingresá un teléfono válido (números, espacios, guiones o +).';
  }

  if (v('correo_electronico') && !EMAIL.test(v('correo_electronico'))) {
    errores.correo_electronico =
      'Ingresá un correo válido, por ejemplo nombre@correo.com.';
  }

  return errores;
}

export const tieneErrores = (errores) => Object.keys(errores).length > 0;
