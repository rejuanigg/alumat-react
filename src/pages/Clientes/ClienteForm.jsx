import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, FormField, Input, Select } from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import { TIPOS_CLIENTE } from './clientes.api.js';
import { tieneErrores, validarCliente } from './validaciones.js';
import styles from './ClienteForm.module.css';

const CAMPOS_POR_TIPO = {
  particular: ['nombre', 'apellido', 'dni'],
  empresa: ['razon_social', 'cuit'],
};

export const CLIENTE_VACIO = {
  tipo_cliente: 'particular',
  nombre: '',
  apellido: '',
  dni: '',
  razon_social: '',
  cuit: '',
  telefono: '',
  correo_electronico: '',
  direccion: '',
  activo: 'true',
};

const ORDEN_CAMPOS = Object.keys(CLIENTE_VACIO);

const OPCIONES_ESTADO = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
];

export function valoresDesdeCliente(cliente) {
  return Object.fromEntries(
    Object.keys(CLIENTE_VACIO).map((campo) => [
      campo,
      String(cliente[campo] ?? CLIENTE_VACIO[campo]),
    ]),
  );
}

function armarPayload(valores) {
  const otroTipo =
    valores.tipo_cliente === 'empresa'
      ? CAMPOS_POR_TIPO.particular
      : CAMPOS_POR_TIPO.empresa;
  const payload = {};
  for (const [campo, valor] of Object.entries(valores)) {
    if (campo === 'activo') payload.activo = valor === 'true';
    else payload[campo] = otroTipo.includes(campo) ? '' : valor.trim();
  }
  return payload;
}

function erroresDelServidor(cuerpo) {
  return Object.fromEntries(
    Object.entries(cuerpo ?? {})
      .filter(([campo]) => campo in CLIENTE_VACIO)
      .map(([campo, mensajes]) => [
        campo,
        Array.isArray(mensajes) ? mensajes.join(' ') : String(mensajes),
      ]),
  );
}

export default function ClienteForm({
  inicial = CLIENTE_VACIO,
  onGuardar,
  textoGuardar = 'Guardar Cliente',
  mostrarEstado = false,
}) {
  const navigate = useNavigate();
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});

  const [errorGeneral, setErrorGeneral] = useState(null);

  const [intentado, setIntentado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const esEmpresa = valores.tipo_cliente === 'empresa';

  const opcionesValidacion = { contactoObligatorio: !mostrarEstado };

  const inactivo = mostrarEstado && inicial.activo === 'false';

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    const nuevos = { ...valores, [name]: value };
    setValores(nuevos);

    if (intentado) setErrores(validarCliente(nuevos, opcionesValidacion));
  };

  const enfocar = (form, encontrados) => {
    const primero = ORDEN_CAMPOS.find((campo) => encontrados[campo]);
    if (primero) form.elements.namedItem(primero)?.focus();
  };

  const guardar = async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget;
    setIntentado(true);
    setErrorGeneral(null);

    const encontrados = validarCliente(valores, opcionesValidacion);
    setErrores(encontrados);
    if (tieneErrores(encontrados)) {
      enfocar(form, encontrados);
      return;
    }

    setGuardando(true);
    try {
      await onGuardar(armarPayload(valores));
    } catch (e) {
      const delServidor = e.status === 400 ? erroresDelServidor(e.errores) : {};
      setErrores(delServidor);

      if (tieneErrores(delServidor)) enfocar(form, delServidor);
      else setErrorGeneral(e);
      setGuardando(false);
    }
  };

  const control = (name) => ({
    name,
    value: valores[name],
    onChange: cambiar,
    disabled: guardando || (inactivo && name !== 'activo'),
  });

  return (
    <form
      className={styles.form}
      onSubmit={guardar}
      noValidate
      aria-busy={guardando}
    >
      {errorGeneral && (
        <p className={styles.errorGeneral} role="alert">
          {errorGeneral.message}
          {errorGeneral.status === 403 &&
            !errorGeneral.errores?.detail?.includes('Dueño') && (
              <a href={URL_LOGIN}>Iniciar sesión</a>
            )}
        </p>
      )}

      <section className={styles.section} aria-labelledby="sec-datos">
        <h2 id="sec-datos" className={styles.sectionTitle}>
          Datos del cliente
        </h2>
        <div className={styles.grid}>
          <FormField
            label="Tipo de cliente"
            required
            error={errores.tipo_cliente}
            className={mostrarEstado ? undefined : styles.full}
          >
            {(field) => (
              <Select
                {...field}
                {...control('tipo_cliente')}
                options={TIPOS_CLIENTE}
              />
            )}
          </FormField>

          {mostrarEstado && (
            <FormField
              label="Estado"
              error={errores.activo}
              hint={
                inactivo
                  ? 'Cliente inactivo: reactivalo para poder editar sus datos.'
                  : 'Un cliente inactivo no se puede elegir en pedidos nuevos.'
              }
            >
              {(field) => (
                <Select
                  {...field}
                  {...control('activo')}
                  options={OPCIONES_ESTADO}
                />
              )}
            </FormField>
          )}

          {esEmpresa ? (
            <>
              <FormField
                label="Razón social"
                required
                error={errores.razon_social}
              >
                {(field) => (
                  <Input
                    {...field}
                    {...control('razon_social')}
                    autoComplete="organization"
                    placeholder="Ej.: Aluminios SA"
                  />
                )}
              </FormField>

              <FormField
                label="CUIT"
                required
                error={errores.cuit}
                hint="11 dígitos, con o sin guiones."
              >
                {(field) => (
                  <Input
                    {...field}
                    {...control('cuit')}
                    inputMode="numeric"
                    placeholder="Ej.: 20-12345678-6"
                  />
                )}
              </FormField>
            </>
          ) : (
            <>
              <FormField label="Nombre" required error={errores.nombre}>
                {(field) => (
                  <Input
                    {...field}
                    {...control('nombre')}
                    autoComplete="given-name"
                    placeholder="Ej.: Laura"
                  />
                )}
              </FormField>

              <FormField label="Apellido" required error={errores.apellido}>
                {(field) => (
                  <Input
                    {...field}
                    {...control('apellido')}
                    autoComplete="family-name"
                    placeholder="Ej.: Gómez"
                  />
                )}
              </FormField>

              <FormField
                label="DNI (opcional)"
                error={errores.dni}
                hint="7 u 8 dígitos, con o sin puntos."
              >
                {(field) => (
                  <Input
                    {...field}
                    {...control('dni')}
                    inputMode="numeric"
                    placeholder="Ej.: 30.123.456"
                  />
                )}
              </FormField>
            </>
          )}

          <FormField
            label="Teléfono"
            required={!mostrarEstado}
            error={errores.telefono}
            hint={
              !mostrarEstado
                ? 'Completá teléfono o correo (al menos uno).'
                : undefined
            }
          >
            {(field) => (
              <Input
                {...field}
                {...control('telefono')}
                type="tel"
                autoComplete="tel"
                placeholder="Ej.: 351 456-7890"
              />
            )}
          </FormField>

          <FormField
            label="Correo"
            required={!mostrarEstado}
            error={errores.correo_electronico}
            className={styles.full}
          >
            {(field) => (
              <Input
                {...field}
                {...control('correo_electronico')}
                type="email"
                autoComplete="email"
                placeholder="Ej.: cliente@correo.com"
              />
            )}
          </FormField>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="sec-direccion">
        <h2 id="sec-direccion" className={styles.sectionTitle}>
          Dirección
        </h2>
        <div className={styles.grid}>
          <FormField
            label="Dirección"
            error={errores.direccion}
            className={styles.full}
          >
            {(field) => (
              <Input
                {...field}
                {...control('direccion')}
                autoComplete="street-address"
                placeholder="Calle, número y localidad"
              />
            )}
          </FormField>
        </div>
      </section>

      <div className={styles.actions}>
        <Button
          variant="outline"
          onClick={() => navigate('/clientes')}
          disabled={guardando}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : textoGuardar}
        </Button>
      </div>
    </form>
  );
}
