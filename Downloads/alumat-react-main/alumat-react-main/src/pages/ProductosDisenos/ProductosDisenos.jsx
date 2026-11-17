import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, PackageCheck, PackageX, Palette, Plus } from 'lucide-react';
import {
  Button,
  ConfirmModal,
  DataTable,
  FilterBar,
  PageHeader,
  Pagination,
  RowActions,
  StatCard,
  StatusTag,
} from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import {
  cambiarActivoProducto,
  listarDisenos,
  listarProductos,
} from './productos.api.js';
import styles from './ProductosDisenos.module.css';

const POR_PAGINA = 6;

const OPCIONES_ESTADO = [
  { value: 'true', label: 'Activo' },
  { value: 'false', label: 'Inactivo' },
];

/** Pantalla "Productos". Datos de /api/productos/ y /api/disenos/. */
export default function ProductosDisenos() {
  const navigate = useNavigate();

  // 1. Datos, carga y error.
  const [productos, setProductos] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // 2. Filtros, página y cambio de estado.
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [aCambiar, setACambiar] = useState(null);
  const [cambiando, setCambiando] = useState(false);
  const [errorCambio, setErrorCambio] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [prods, dis] = await Promise.all([
        listarProductos(),
        listarDisenos(),
      ]);
      setProductos(prods);
      setDisenos(dis);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const disenosPorProducto = useMemo(() => {
    const cuenta = {};
    for (const d of disenos) {
      cuenta[d.id_producto] = (cuenta[d.id_producto] ?? 0) + 1;
    }
    return cuenta;
  }, [disenos]);

  const opcionesTipo = useMemo(
    () =>
      [...new Set(productos.map((p) => p.tipo_abertura))]
        .sort()
        .map((t) => ({ value: t, label: t })),
    [productos],
  );

  // 3. Filtrado.
  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter(
      (p) =>
        (!tipo || p.tipo_abertura === tipo) &&
        (!estado || String(p.activo) === estado) &&
        (!texto ||
          p.nombre.toLowerCase().includes(texto) ||
          p.descripcion.toLowerCase().includes(texto)),
    );
  }, [productos, busqueda, tipo, estado]);

  // 4. Indicadores: sobre el total, no sobre lo filtrado.
  const activos = productos.filter((p) => p.activo).length;

  // 5. Paginación.
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
    setTipo('');
    setEstado('');
    setPagina(1);
  };

  // El backend no borra productos: los da de baja o los reactiva (activo).
  const confirmarCambio = async () => {
    setCambiando(true);
    setErrorCambio(null);
    try {
      const actualizado = await cambiarActivoProducto(
        aCambiar.id_producto,
        !aCambiar.activo,
      );
      setProductos((lista) =>
        lista.map((p) =>
          p.id_producto === actualizado.id_producto ? actualizado : p,
        ),
      );
      setACambiar(null);
    } catch (e) {
      setErrorCambio(e.message);
    } finally {
      setCambiando(false);
    }
  };

  const cancelarCambio = () => {
    setACambiar(null);
    setErrorCambio(null);
  };

  const columnas = [
    { key: 'id_producto', label: '#' },
    { key: 'nombre', label: 'Producto' },
    { key: 'tipo_abertura', label: 'Tipo de abertura' },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (valor) => valor || '—',
    },
    {
      key: 'id_producto',
      label: 'Diseños',
      render: (valor) => disenosPorProducto[valor] ?? 0,
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (valor) => <StatusTag status={valor ? 'Activo' : 'Inactivo'} />,
    },
  ];

  const hayFiltros = busqueda.trim() !== '' || tipo !== '' || estado !== '';
  let mensajeVacio = 'Todavía no hay productos cargados.';
  if (cargando) mensajeVacio = 'Cargando productos...';
  else if (error)
    mensajeVacio = <MensajeError error={error} onRetry={cargar} />;
  else if (hayFiltros) mensajeVacio = 'No hay productos con esos filtros.';

  const indicador = (valor) => (cargando || error ? '—' : valor);

  return (
    <>
      <PageHeader
        title="Productos"
        subtitle="Consultá y administrá los productos y sus diseños."
        icon={<Package />}
        actions={
          <>
            <Button
              variant="outline"
              icon={<Palette />}
              onClick={() => navigate('/disenos/nuevo')}
            >
              Nuevo diseño
            </Button>
            <Button
              icon={<Plus />}
              onClick={() => navigate('/productos/nuevo')}
            >
              Nuevo producto
            </Button>
          </>
        }
      />

      <section
        className={styles.page}
        aria-label="Listado de productos"
        aria-busy={cargando}
      >
        <FilterBar
          searchValue={busqueda}
          onSearchChange={cambiarFiltro(setBusqueda)}
          searchLabel="Buscar productos"
          searchPlaceholder="Nombre o descripción"
          filters={[
            {
              name: 'tipo',
              label: 'Tipo de abertura',
              value: tipo,
              options: opcionesTipo,
              placeholder: 'Todos',
              onChange: cambiarFiltro(setTipo),
            },
            {
              name: 'estado',
              label: 'Estado',
              value: estado,
              options: OPCIONES_ESTADO,
              placeholder: 'Todos',
              onChange: cambiarFiltro(setEstado),
            },
          ]}
          onClear={limpiar}
          disabled={cargando || Boolean(error)}
        />

        <div className={styles.stats}>
          <StatCard
            title="Total de productos"
            value={indicador(productos.length)}
            icon={<Package />}
            variant="products"
          />
          <StatCard
            title="Productos activos"
            value={indicador(activos)}
            icon={<PackageCheck />}
            variant="orders"
          />
          <StatCard
            title="Productos inactivos"
            value={indicador(productos.length - activos)}
            icon={<PackageX />}
            variant="sales"
          />
          <StatCard
            title="Diseños registrados"
            value={indicador(disenos.length)}
            icon={<Palette />}
            variant="clients"
          />
        </div>

        <DataTable
          caption="Productos"
          columns={columnas}
          rows={cargando || error ? [] : visibles}
          rowKey="id_producto"
          emptyMessage={mensajeVacio}
          renderActions={(fila) => (
            <RowActions
              itemName={fila.nombre}
              onView={() => navigate(`/productos/${fila.id_producto}`)}
              onEdit={() => navigate(`/productos/${fila.id_producto}/editar`)}
              // Baja lógica: el botón de eliminar da de baja (o reactiva).
              onDelete={() => setACambiar(fila)}
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

      <ConfirmModal
        open={aCambiar !== null}
        title={aCambiar?.activo ? 'Dar de baja producto' : 'Reactivar producto'}
        message={
          aCambiar
            ? errorCambio ||
              (aCambiar.activo
                ? `¿Querés dar de baja "${aCambiar.nombre}"? Sus diseños dejarán de estar disponibles en los pedidos.`
                : `¿Querés reactivar "${aCambiar.nombre}"?`)
            : ''
        }
        confirmLabel={aCambiar?.activo ? 'Dar de baja' : 'Reactivar'}
        onConfirm={confirmarCambio}
        onCancel={cancelarCambio}
        busy={cambiando}
      />
    </>
  );
}

/** Mensaje de error dentro de la tabla, con reintento o enlace al login. */
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
