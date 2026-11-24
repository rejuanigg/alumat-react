import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Palette, Plus } from 'lucide-react';
import {
  Button,
  DataTable,
  FilterBar,
  FormField,
  Input,
  PageHeader,
  Pagination,
  RowActions,
  StatCard,
} from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import { mensajesDeError } from '../../api/errores.js';
import {
  listarDisenos,
  listarProductos,
  renombrarDiseno,
} from '../ProductosDisenos/productos.api.js';
import ModalFormulario from '../Cajas/ModalFormulario.jsx';
import styles from '../Listado.module.css';

const POR_PAGINA = 8;

export default function Disenos() {
  const navigate = useNavigate();

  const [disenos, setDisenos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [producto, setProducto] = useState('');
  const [pagina, setPagina] = useState(1);

  const [aRenombrar, setARenombrar] = useState(null);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [dis, prods] = await Promise.all([
        listarDisenos(),
        listarProductos(),
      ]);
      setDisenos(dis);
      setProductos(prods);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const nombreProducto = useMemo(
    () => Object.fromEntries(productos.map((p) => [p.id_producto, p.nombre])),
    [productos],
  );

  const opcionesProducto = useMemo(
    () =>
      productos.map((p) => ({
        value: String(p.id_producto),
        label: p.nombre,
      })),
    [productos],
  );

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return disenos.filter(
      (d) =>
        (!producto || String(d.id_producto) === producto) &&
        (!texto ||
          d.nombre_diseno.toLowerCase().includes(texto) ||
          (nombreProducto[d.id_producto] ?? '').toLowerCase().includes(texto)),
    );
  }, [disenos, busqueda, producto, nombreProducto]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  const cambiarFiltro = (setter) => (evento) => {
    setter(evento.target.value);
    setPagina(1);
  };

  const limpiar = () => {
    setBusqueda('');
    setProducto('');
    setPagina(1);
  };

  const reemplazar = (actualizado) =>
    setDisenos((lista) =>
      lista.map((d) =>
        d.id_diseno === actualizado.id_diseno ? actualizado : d,
      ),
    );

  const abrirRenombrar = (diseno) => {
    setNombreNuevo(diseno.nombre_diseno);
    setErrorAccion(null);
    setARenombrar(diseno);
  };

  const guardarNombre = async () => {
    if (!nombreNuevo.trim()) {
      setErrorAccion('Ingresá el nombre del diseño.');
      return;
    }
    setProcesando(true);
    setErrorAccion(null);
    try {
      reemplazar(
        await renombrarDiseno(aRenombrar.id_diseno, nombreNuevo.trim()),
      );
      setARenombrar(null);
    } catch (e) {
      setErrorAccion(mensajesDeError(e));
    } finally {
      setProcesando(false);
    }
  };

  const cerrarAcciones = () => {
    setARenombrar(null);
    setErrorAccion(null);
  };

  const columnas = [
    { key: 'id_diseno', label: '#' },
    { key: 'nombre_diseno', label: 'Diseño' },
    {
      key: 'id_producto',
      label: 'Producto',
      render: (valor) => nombreProducto[valor] ?? `#${valor}`,
    },
  ];

  const hayFiltros = busqueda.trim() !== '' || producto !== '';
  let mensajeVacio = 'Todavía no hay diseños cargados.';
  if (cargando) mensajeVacio = 'Cargando diseños...';
  else if (error)
    mensajeVacio = <MensajeError error={error} onRetry={cargar} />;
  else if (hayFiltros) mensajeVacio = 'No hay diseños con esos filtros.';

  const indicador = (valor) => (cargando || error ? '—' : valor);

  return (
    <>
      <PageHeader
        title="Diseños"
        subtitle="Consultá y administrá los diseños de cada producto."
        icon={<Palette />}
        actions={
          <Button icon={<Plus />} onClick={() => navigate('/disenos/nuevo')}>
            Nuevo diseño
          </Button>
        }
      />

      <section
        className={styles.page}
        aria-label="Listado de diseños"
        aria-busy={cargando}
      >
        <FilterBar
          searchValue={busqueda}
          onSearchChange={cambiarFiltro(setBusqueda)}
          searchLabel="Buscar diseños"
          searchPlaceholder="Nombre del diseño o del producto"
          filters={[
            {
              name: 'producto',
              label: 'Producto',
              value: producto,
              options: opcionesProducto,
              placeholder: 'Todos',
              onChange: cambiarFiltro(setProducto),
            },
          ]}
          onClear={limpiar}
          disabled={cargando || Boolean(error)}
        />

        <div className={styles.stats}>
          <StatCard
            title="Total de diseños"
            value={indicador(disenos.length)}
            icon={<Palette />}
            variant="clients"
          />
        </div>

        <DataTable
          caption="Diseños"
          columns={columnas}
          rows={cargando || error ? [] : visibles}
          rowKey="id_diseno"
          emptyMessage={mensajeVacio}
          renderActions={(fila) => (
            <RowActions
              itemName={fila.nombre_diseno}
              onEdit={() => abrirRenombrar(fila)}
            />
          )}
        />

        <Pagination
          page={paginaActual}
          pageSize={POR_PAGINA}
          total={filtrados.length}
          onPageChange={setPagina}
          disabled={cargando}
        />
      </section>

      <ModalFormulario
        open={aRenombrar !== null}
        title="Editar diseño"
        submitLabel="Guardar"
        onSubmit={guardarNombre}
        onCancel={cerrarAcciones}
        busy={procesando}
        error={errorAccion}
      >
        <FormField label="Nombre del diseño" required>
          {(field) => (
            <Input
              {...field}
              maxLength={100}
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
            />
          )}
        </FormField>
      </ModalFormulario>
    </>
  );
}

function MensajeError({ error, onRetry }) {
  return (
    <span className={styles.error} role="alert">
      {error.message}
      {error.status === 403 ? (
        <a href={URL_LOGIN}>Iniciar sesión</a>
      ) : (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </span>
  );
}
