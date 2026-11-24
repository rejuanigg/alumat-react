import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { PackageOpen } from 'lucide-react';
import { Button, PageHeader } from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import { actualizarProducto, obtenerProducto } from './productos.api.js';
import ProductoForm, { valoresDesdeProducto } from './ProductoForm.jsx';
import styles from '../Clientes/ClienteForm.module.css';

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setProducto(await obtenerProducto(id));
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const guardar = async (datos) => {
    await actualizarProducto(id, datos);
    navigate('/productos');
  };

  return (
    <>
      <PageHeader
        title="Editar producto"
        subtitle={
          producto
            ? `Modificá los datos de ${producto.nombre} (producto #${producto.id_producto}).`
            : 'Modificá los datos del producto.'
        }
        icon={<PackageOpen />}
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
        <ProductoForm
          key={producto.id_producto}
          inicial={valoresDesdeProducto(producto)}
          onGuardar={guardar}
          textoGuardar="Guardar cambios"
          mostrarEstado
        />
      )}
    </>
  );
}
