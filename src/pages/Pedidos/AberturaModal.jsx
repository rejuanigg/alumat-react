import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FormField, Input, Select, Textarea } from '../../components';
import ModalFormulario from '../Cajas/ModalFormulario.jsx';
import {
  COLORES_ALUMINIO,
  TIPOS_REVESTIMIENTO,
  TIPOS_VIDRIO,
} from './pedidos.api.js';

const VACIO = {
  id_diseno: '',
  ancho: '',
  alto: '',
  cantidad: '1',
  tipo_vidrio: '',
  color_aluminio: '',
  tipo_revestimiento: '',
  observaciones: '',
};

/**
 * Modal para cargar una abertura (producto + medidas + terminaciones).
 * Valida y llama a onSubmit(datos), con los datos como los pide la API.
 * La página decide qué hacer (guardar en la API o en una lista) y cierra
 * el modal. `error` es un error que viene de la página.
 */
export default function AberturaModal({
  open,
  opcionesDiseno,
  onSubmit,
  onCancel,
  busy = false,
  error = null,
}) {
  const [form, setForm] = useState(VACIO);
  const [errorLocal, setErrorLocal] = useState(null);

  // Cada vez que se abre, arranca vacío.
  useEffect(() => {
    if (open) {
      setForm(VACIO);
      setErrorLocal(null);
    }
  }, [open]);

  const campo = (nombre) => ({
    value: form[nombre],
    onChange: (e) => setForm((f) => ({ ...f, [nombre]: e.target.value })),
  });

  const enviar = () => {
    if (!form.id_diseno || !form.color_aluminio) {
      setErrorLocal('Elegí el producto/diseño y el color del aluminio.');
      return;
    }
    if (!(Number(form.ancho) > 0) || !(Number(form.alto) > 0)) {
      setErrorLocal('Ingresá un ancho y un alto mayores a 0.');
      return;
    }
    if (!(Number(form.cantidad) >= 1)) {
      setErrorLocal('La cantidad debe ser 1 o más.');
      return;
    }
    setErrorLocal(null);
    onSubmit({
      id_diseno: Number(form.id_diseno),
      ancho: form.ancho,
      alto: form.alto,
      cantidad: Number(form.cantidad),
      tipo_vidrio: form.tipo_vidrio,
      color_aluminio: form.color_aluminio,
      tipo_revestimiento: form.tipo_revestimiento,
      observaciones: form.observaciones.trim(),
    });
  };

  return (
    <ModalFormulario
      open={open}
      title="Agregar producto"
      submitLabel="Agregar"
      onSubmit={enviar}
      onCancel={onCancel}
      busy={busy}
      error={errorLocal || error}
    >
      {opcionesDiseno.length === 0 && (
        <p role="status">
          No hay productos con diseños activos para elegir. Cargalos primero en{' '}
          <Link to="/productos/nuevo">Productos</Link> y{' '}
          <Link to="/disenos/nuevo">Diseños</Link>.
        </p>
      )}
      <FormField label="Producto - Diseño" required>
        {(field) => (
          <Select
            {...field}
            placeholder="Seleccioná un diseño"
            options={opcionesDiseno}
            {...campo('id_diseno')}
          />
        )}
      </FormField>
      <FormField label="Ancho" required>
        {(field) => (
          <Input
            {...field}
            type="number"
            min="0.01"
            max="9999.99"
            step="0.01"
            inputMode="decimal"
            {...campo('ancho')}
          />
        )}
      </FormField>
      <FormField label="Alto" required>
        {(field) => (
          <Input
            {...field}
            type="number"
            min="0.01"
            max="9999.99"
            step="0.01"
            inputMode="decimal"
            {...campo('alto')}
          />
        )}
      </FormField>
      <FormField label="Cantidad" required>
        {(field) => (
          <Input
            {...field}
            type="number"
            min="1"
            step="1"
            {...campo('cantidad')}
          />
        )}
      </FormField>
      <FormField label="Color del aluminio" required>
        {(field) => (
          <Select
            {...field}
            placeholder="Seleccioná un color"
            options={COLORES_ALUMINIO}
            {...campo('color_aluminio')}
          />
        )}
      </FormField>
      <FormField label="Tipo de vidrio (opcional)">
        {(field) => (
          <Select
            {...field}
            placeholder="Sin vidrio"
            options={TIPOS_VIDRIO}
            {...campo('tipo_vidrio')}
          />
        )}
      </FormField>
      <FormField label="Revestimiento (opcional)">
        {(field) => (
          <Select
            {...field}
            placeholder="Sin revestimiento"
            options={TIPOS_REVESTIMIENTO}
            {...campo('tipo_revestimiento')}
          />
        )}
      </FormField>
      <FormField label="Observaciones (opcional)">
        {(field) => (
          <Textarea {...field} rows={2} {...campo('observaciones')} />
        )}
      </FormField>
    </ModalFormulario>
  );
}
