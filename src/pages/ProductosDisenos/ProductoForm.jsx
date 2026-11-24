import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, FormField, Input, Select, Textarea } from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import styles from '../Clientes/ClienteForm.module.css';

export const PRODUCTO_VACIO = {
  nombre: '',
  tipo_abertura: '',
  descripcion: '',
  activo: 'true',
};

const OPCIONES_ESTADO = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
];

export function valoresDesdeProducto(producto) {
  return Object.fromEntries(
    Object.keys(PRODUCTO_VACIO).map((campo) => [
      campo,
      String(producto[campo] ?? PRODUCTO_VACIO[campo]),
    ]),
  );
}

function validar(v) {
  const e = {};
  if (!v.nombre.trim()) e.nombre = 'Ingresá el nombre del producto.';
  if (!v.tipo_abertura.trim()) e.tipo_abertura = 'Ingresá el tipo de abertura.';
  return e;
}

function erroresDelServidor(cuerpo) {
  const e = {};
  for (const [campo, msgs] of Object.entries(cuerpo ?? {})) {
    e[campo === 'non_field_errors' ? 'general' : campo] = []
      .concat(msgs)
      .join(' ');
  }
  return e;
}

export default function ProductoForm({
  inicial = PRODUCTO_VACIO,
  onGuardar,
  textoGuardar = 'Guardar producto',
  mostrarEstado = false,
}) {
  const navigate = useNavigate();
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const inactivo = mostrarEstado && inicial.activo === 'false';

  const control = (campo) => ({
    name: campo,
    value: valores[campo],
    disabled: guardando || (inactivo && campo !== 'activo'),
    onChange: (evento) => {
      setValores((v) => ({ ...v, [campo]: evento.target.value }));
      setErrores((e) => ({ ...e, [campo]: undefined }));
    },
  });

  const enviar = async (evento) => {
    evento.preventDefault();
    const encontrados = validar(valores);
    setErrores(encontrados);
    setErrorGeneral(null);
    if (Object.keys(encontrados).length) return;

    setGuardando(true);
    try {
      await onGuardar({
        nombre: valores.nombre.trim(),
        tipo_abertura: valores.tipo_abertura.trim(),
        descripcion: valores.descripcion.trim(),
        activo: valores.activo === 'true',
      });
    } catch (e) {
      if (e.status === 400) {
        const { general, ...campos } = erroresDelServidor(e.errores);
        setErrores(campos);
        setErrorGeneral(general ? { message: general } : null);
      } else {
        setErrorGeneral(e);
      }
      setGuardando(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={enviar} noValidate>
      {errorGeneral && (
        <div className={styles.errorGeneral} role="alert">
          {errorGeneral.message}
          {errorGeneral.status === 403 && (
            <a href={URL_LOGIN}>Iniciar sesión</a>
          )}
        </div>
      )}

      <section className={styles.section} aria-labelledby="sec-producto">
        <h2 id="sec-producto" className={styles.sectionTitle}>
          Datos del producto
        </h2>
        <div className={styles.grid}>
          <FormField label="Nombre" required error={errores.nombre}>
            {(field) => (
              <Input
                {...field}
                {...control('nombre')}
                maxLength={100}
                placeholder="Ej.: Ventana corrediza"
              />
            )}
          </FormField>

          <FormField
            label="Tipo de abertura"
            required
            error={errores.tipo_abertura}
          >
            {(field) => (
              <Input
                {...field}
                {...control('tipo_abertura')}
                maxLength={100}
                placeholder="Ej.: Corrediza"
              />
            )}
          </FormField>

          {mostrarEstado && (
            <FormField
              label="Estado"
              error={errores.activo}
              hint={
                inactivo
                  ? 'Producto inactivo: reactivalo para poder editar sus datos.'
                  : undefined
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

          <FormField
            label="Descripción (opcional)"
            error={errores.descripcion}
            className={styles.full}
          >
            {(field) => (
              <Textarea
                {...field}
                {...control('descripcion')}
                placeholder="Ej.: Ventana de aluminio de dos hojas corredizas."
              />
            )}
          </FormField>
        </div>
      </section>

      <div className={styles.actions}>
        <Button
          variant="outline"
          onClick={() => navigate('/productos')}
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
