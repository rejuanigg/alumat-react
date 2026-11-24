import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Package, Pencil, Plus } from 'lucide-react';
import { Button, DataTable, PageHeader, StatusTag } from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import { listarDisenos, obtenerProducto } from './productos.api.js';
import styles from '../Clientes/ClienteForm.module.css';

const COLUMNAS = [
  { key: 'id_diseno', label: '#' },
  { key: 'nombre_diseno', label: 'Diseño' },
];

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [disenos, setDisenos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [prod, dis] = await Promise.all([
        obtenerProducto(id),
        listarDisenos({ id_producto: id }),
      ]);
      setProducto(prod);
      setDisenos(dis);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <>
      <PageHeader
        title={producto ? producto.nombre : 'Detalle de producto'}
        subtitle={producto ? `Producto #${producto.id_producto}` : undefined}
        icon={<Package />}
        actions={
          <>
            <Button
              variant="outline"
              icon={<ArrowLeft />}
              onClick={() => navigate('/productos')}
            >
              Volver
            </Button>
            {producto && (
              <Button
                variant="outline"
                icon={<Pencil />}
                onClick={() => navigate(`/productos/${id}/editar`)}
              >
                Editar
              </Button>
            )}
          </>
        }
      />

      {cargando && (
        <p className={styles.section} aria-busy="true">
          Cargando producto...
        </p>
      )}

      {!cargando && error && (
        <div className={styles.errorGeneral} role="alert">
          {error.status === 404 ? 'El producto no existe.' : error.message}
          {error.status === 403 ? (
            <a href={URL_LOGIN}>Iniciar sesión</a>
          ) : error.status === 404 ? (
            <Link to="/productos">Volver al listado</Link>
          ) : (
            <Button variant="outline" onClick={cargar}>
              Reintentar
            </Button>
          )}
        </div>
      )}

      {!cargando && producto && (
        <div className={styles.form}>
          <section className={styles.section} aria-labelledby="sec-datos">
            <h2 id="sec-datos" className={styles.sectionTitle}>
              Datos del producto
            </h2>
            <dl className={styles.grid}>
              <div>
                <dt>Tipo de abertura</dt>
                <dd>{producto.tipo_abertura}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>
                  <StatusTag status={producto.activo ? 'Activo' : 'Inactivo'} />
                </dd>
              </div>
              <div className={styles.full}>
                <dt>Descripción</dt>
                <dd>{producto.descripcion || '—'}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.section} aria-labelledby="sec-disenos">
            <h2 id="sec-disenos" className={styles.sectionTitle}>
              Diseños del producto
            </h2>
            <DataTable
              caption="Diseños del producto"
              columns={COLUMNAS}
              rows={disenos}
              rowKey="id_diseno"
              emptyMessage="Este producto todavía no tiene diseños."
            />
            <div className={styles.actions}>
              <Button
                icon={<Plus />}
                onClick={() => navigate('/disenos/nuevo')}
              >
                Nuevo diseño
              </Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
