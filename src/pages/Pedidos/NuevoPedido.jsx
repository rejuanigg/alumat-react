import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ClipboardPlus } from 'lucide-react';
import {
  Button,
  FormField,
  PageHeader,
  Select,
  Textarea,
} from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import { listarClientes, nombreCliente } from '../Clientes/clientes.api.js';
import { crearPedido } from './pedidos.api.js';
import styles from '../Clientes/ClienteForm.module.css';

/**
 * Pantalla "Nuevo pedido": elige el cliente y guarda. Después lleva al
 * detalle del pedido, donde se cargan sus aberturas.
 */
export default function NuevoPedido() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [idCliente, setIdCliente] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    listarClientes().then(setClientes).catch(setErrorGeneral);
  }, []);

  // Solo clientes activos: el backend rechaza los inactivos.
  const opciones = useMemo(
    () =>
      clientes
        .filter((c) => c.activo)
        .map((c) => ({ value: String(c.id_cliente), label: nombreCliente(c) })),
    [clientes],
  );

  const guardar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral(null);
    if (!idCliente) {
      setErrores({ id_cliente: 'Seleccioná un cliente.' });
      return;
    }
    setErrores({});
    setGuardando(true);
    try {
      const pedido = await crearPedido({
        id_cliente: Number(idCliente),
        observaciones: observaciones.trim(),
      });
      navigate(`/pedidos/${pedido.id_pedido}`);
    } catch (e) {
      if (e.status === 400) {
        const delServidor = {};
        for (const [campo, msgs] of Object.entries(e.errores ?? {})) {
          delServidor[campo] = [].concat(msgs).join(' ');
        }
        const { non_field_errors, ...campos } = delServidor;
        setErrores(campos);
        setErrorGeneral(
          non_field_errors ? { message: non_field_errors } : null,
        );
      } else {
        setErrorGeneral(e);
      }
      setGuardando(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Nuevo pedido"
        subtitle="Elegí el cliente. Los detalles se cargan después, en el pedido."
        icon={<ClipboardPlus />}
      />

      <form className={styles.form} onSubmit={guardar} noValidate>
        {errorGeneral && (
          <div className={styles.errorGeneral} role="alert">
            {errorGeneral.message}
            {errorGeneral.status === 403 && (
              <a href={URL_LOGIN}>Iniciar sesión</a>
            )}
          </div>
        )}

        <section className={styles.section} aria-labelledby="sec-pedido">
          <h2 id="sec-pedido" className={styles.sectionTitle}>
            Datos del pedido
          </h2>
          <div className={styles.grid}>
            <FormField
              label="Cliente"
              required
              error={errores.id_cliente}
              hint="Solo se muestran los clientes activos."
            >
              {(field) => (
                <Select
                  {...field}
                  placeholder="Seleccioná un cliente"
                  options={opciones}
                  value={idCliente}
                  onChange={(e) => {
                    setIdCliente(e.target.value);
                    setErrores({});
                  }}
                />
              )}
            </FormField>

            <FormField
              label="Observaciones (opcional)"
              error={errores.observaciones}
              className={styles.full}
            >
              {(field) => (
                <Textarea
                  {...field}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Datos adicionales del pedido"
                />
              )}
            </FormField>
          </div>
        </section>

        <div className={styles.actions}>
          <Button
            variant="outline"
            onClick={() => navigate('/pedidos')}
            disabled={guardando}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar pedido'}
          </Button>
        </div>
      </form>
    </>
  );
}
