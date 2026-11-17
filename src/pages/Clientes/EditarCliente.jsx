import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { UserPen } from 'lucide-react';
import { Button, PageHeader } from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import {
  actualizarCliente,
  nombreCliente,
  obtenerCliente,
} from './clientes.api.js';
import ClienteForm, { valoresDesdeCliente } from './ClienteForm.jsx';
import styles from './ClienteForm.module.css';

/** Pantalla "Editar cliente": /clientes/:id/editar. */
export default function EditarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setCliente(await obtenerCliente(id));
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
    await actualizarCliente(id, datos);
    navigate('/clientes');
  };

  return (
    <>
      <PageHeader
        title="Editar cliente"
        subtitle={
          cliente
            ? `Modificá los datos de ${nombreCliente(cliente)} (cliente #${cliente.id_cliente}).`
            : 'Modificá los datos del cliente.'
        }
        icon={<UserPen />}
      />

      {cargando && (
        <p className={styles.section} aria-busy="true">
          Cargando cliente...
        </p>
      )}

      {!cargando && error && (
        <div className={styles.errorGeneral} role="alert">
          {error.status === 404
            ? 'El cliente no existe o fue eliminado.'
            : error.message}
          {error.status === 403 ? (
            <a href={URL_LOGIN}>Iniciar sesión</a>
          ) : error.status === 404 ? (
            <Link to="/clientes">Volver al listado</Link>
          ) : (
            <Button variant="outline" onClick={cargar}>
              Reintentar
            </Button>
          )}
        </div>
      )}

      {!cargando && cliente && (
        // key: si cambia el cliente, el formulario arranca de cero.
        <ClienteForm
          key={cliente.id_cliente}
          inicial={valoresDesdeCliente(cliente)}
          onGuardar={guardar}
          textoGuardar="Guardar cambios"
          mostrarEstado
        />
      )}
    </>
  );
}
