import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Box, ClipboardList, Save, X } from 'lucide-react';
import {
  Button,
  DataTable,
  FormField,
  Input,
  PageHeader,
  SearchSelect,
} from '../../components';
import { ApiError } from '../../api/client.js';
import {
  crearDiseno,
  listarDisenos,
  listarProductos,
} from '../ProductosDisenos/productos.api.js';
import styles from './NuevoDiseno.module.css';

const INICIAL = { id_producto: '', nombre: '' };

export default function NuevoDiseno() {
  const navigate = useNavigate();
  const volver = () => navigate('/disenos');

  const [form, setForm] = useState(INICIAL);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cambiar = (campo) => (evento) => {
    const { value } = evento.target;
    setForm((f) => ({ ...f, [campo]: value }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const [productos, setProductos] = useState([]);
  const [registrados, setRegistrados] = useState([]);

  useEffect(() => {
    listarProductos({ activo: true })
      .then(setProductos)
      .catch((e) => setErrores({ general: e.message }));
  }, []);

  useEffect(() => {
    if (!form.id_producto) return;
    let vigente = true;
    listarDisenos({ id_producto: form.id_producto })
      .then((lista) => vigente && setRegistrados(lista))
      .catch((e) => vigente && setErrores({ general: e.message }));
    return () => {
      vigente = false;
    };
  }, [form.id_producto]);

  const opcionesProducto = useMemo(
    () =>
      productos.map((p) => ({
        value: String(p.id_producto),
        label: p.nombre,
        description: p.tipo_abertura,
        filtros: { tipo_abertura: p.tipo_abertura },
      })),
    [productos],
  );
  const filtrosProducto = useMemo(
    () => [
      {
        name: 'tipo_abertura',
        label: 'Tipo de abertura',
        options: [...new Set(productos.map((p) => p.tipo_abertura))]
          .filter(Boolean)
          .map((t) => ({ value: t, label: t })),
      },
    ],
    [productos],
  );
  const producto = productos.find(
    (p) => String(p.id_producto) === form.id_producto,
  );
  const disenos = (form.id_producto ? registrados : []).map((d) => ({
    ...d,
    nombre: d.nombre_diseno,
    producto: producto?.nombre,
  }));

  const columnas = [
    { key: 'nombre', label: 'Diseño' },
    { key: 'producto', label: 'Producto' },
  ];

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
      await crearDiseno({
        id_producto: Number(form.id_producto),
        nombre_diseno: form.nombre.trim(),
      });
      navigate('/disenos');
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        const { nombre_diseno, id_producto, ...resto } = error.errores;
        const nuevos = {};
        if (id_producto) nuevos.id_producto = id_producto.join(' ');
        if (nombre_diseno) nuevos.nombre = nombre_diseno.join(' ');
        const general = resto.non_field_errors ?? resto.detail;
        if (general) nuevos.general = [].concat(general).join(' ');
        setErrores(
          Object.keys(nuevos).length ? nuevos : { general: error.message },
        );
      } else {
        setErrores({ general: error.message });
      }
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
                <SearchSelect
                  {...field}
                  placeholder="Buscá un producto"
                  searchPlaceholder="Nombre o tipo de abertura..."
                  options={opcionesProducto}
                  filters={filtrosProducto}
                  value={form.id_producto}
                  onChange={(v) => cambiar('id_producto')({ target: { value: v } })}
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
