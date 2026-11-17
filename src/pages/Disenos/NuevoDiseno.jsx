import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Box, ClipboardList, Save, X } from 'lucide-react';
import {
  Button,
  DataTable,
  FormField,
  Input,
  PageHeader,
  Select,
  StatusTag,
} from '../../components';
import { DISENOS, PRODUCTOS } from './disenos.mock.js';
import styles from './NuevoDiseno.module.css';

// Solo se ofrecen productos activos (lo indica la ayuda del formulario).
const OPCIONES_PRODUCTO = PRODUCTOS.filter((p) => p.activo).map((p) => ({
  value: String(p.id_producto),
  label: p.nombre,
}));

const INICIAL = { id_producto: '', nombre: '', activo: true };

/**
 * Pantalla "Nuevo diseño".
 * Por ahora usa datos de prueba (disenos.mock.js).
 */
export default function NuevoDiseno() {
  const navigate = useNavigate();
  const volver = () => navigate('/disenos');

  // 1. Estado del formulario.
  const [form, setForm] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (evento) => {
    const { type, checked, value } = evento.target;
    setForm((f) => ({ ...f, [campo]: type === 'checkbox' ? checked : value }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  // 2. Diseños ya registrados del producto elegido.
  const producto = PRODUCTOS.find(
    (p) => String(p.id_producto) === form.id_producto,
  );
  const disenos = DISENOS.filter(
    (d) => String(d.id_producto) === form.id_producto,
  ).map((d) => ({ ...d, producto: producto?.nombre }));

  const columnas = [
    { key: 'nombre', label: 'Diseño' },
    { key: 'producto', label: 'Producto' },
    {
      key: 'activo',
      label: 'Estado',
      render: (valor) => <StatusTag status={valor ? 'Activo' : 'Inactivo'} />,
    },
  ];

  // 3. Validación y envío.
  function validar() {
    const e = {};
    if (!form.id_producto) e.id_producto = 'Seleccioná un producto.';
    if (!form.nombre.trim()) e.nombre = 'Ingresá el nombre del diseño.';
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function guardar(evento) {
    evento.preventDefault();
    if (!validar()) return;
    setGuardando(true);
    try {
      const datos = {
        id_producto: Number(form.id_producto),
        nombre: form.nombre.trim(),
        activo: form.activo,
      };
      // TODO: ajustar la URL al endpoint real de Django.
      // const res = await fetch('/api/disenos/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(datos),
      // });
      // if (!res.ok) throw new Error('No se pudo guardar el diseño.');
      console.log('Enviaría:', datos);
      volver();
    } catch (error) {
      setErrores({ general: error.message });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Nuevo diseño"
        subtitle="Registre un diseño asociado a un producto existente"
        icon={<Box />}
        actions={
          <Button variant="outline" icon={<ArrowLeft />} onClick={volver}>
            Volver
          </Button>
        }
      />

      <form className={styles.form} onSubmit={guardar} noValidate>
        <section className={styles.card} aria-labelledby="titulo-datos">
          <h2 id="titulo-datos" className={styles.cardTitle}>
            <ClipboardList aria-hidden="true" /> Datos del diseño
          </h2>

          <div className={styles.grid}>
            <FormField label="Producto" required error={errores.id_producto}>
              {(field) => (
                <Select
                  {...field}
                  placeholder="Seleccione un producto"
                  options={OPCIONES_PRODUCTO}
                  value={form.id_producto}
                  onChange={cambiar('id_producto')}
                />
              )}
            </FormField>

            <FormField
              label="Nombre del diseño"
              required
              error={errores.nombre}
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="Ej: Corrediza dos hojas con mosquitero"
                  value={form.nombre}
                  onChange={cambiar('nombre')}
                />
              )}
            </FormField>
          </div>

          <div className={styles.estado}>
            <span className={styles.label}>Estado</span>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={form.activo}
                onChange={cambiar('activo')}
              />
              Activo (disponible para elegir en pedidos)
            </label>
          </div>

          <p className={styles.hint}>Solo se muestran los productos activos.</p>
        </section>

        <section className={styles.card} aria-labelledby="titulo-registrados">
          <h2 id="titulo-registrados" className={styles.cardTitle}>
            <Box aria-hidden="true" /> Diseños ya registrados del producto
            elegido
          </h2>

          <DataTable
            caption="Diseños registrados del producto elegido"
            columns={columnas}
            rows={disenos}
            rowKey="id_diseno"
            emptyMessage={
              form.id_producto
                ? 'Este producto todavía no tiene diseños.'
                : 'Elegí un producto para ver sus diseños.'
            }
          />
        </section>

        {errores.general && (
          <p className={styles.errorGeneral} role="alert">
            {errores.general}
          </p>
        )}

        <div className={styles.actions}>
          <Button variant="outline" icon={<X />} onClick={volver}>
            Cancelar
          </Button>
          <Button type="submit" icon={<Save />} disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar diseño'}
          </Button>
        </div>
      </form>
    </>
  );
}
