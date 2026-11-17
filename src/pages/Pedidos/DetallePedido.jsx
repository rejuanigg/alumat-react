import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, ClipboardList, Plus, Receipt } from 'lucide-react';
import {
  Button,
  ConfirmModal,
  DataTable,
  PageHeader,
  RowActions,
  StatusTag,
} from '../../components';
import { URL_LOGIN, api } from '../../api/client.js';
import { mensajesDeError } from '../../api/errores.js';
import { obtenerCliente, nombreCliente } from '../Clientes/clientes.api.js';
import { formatFechaHora } from '../Cajas/formatos.js';
import AberturaModal from './AberturaModal.jsx';
import { columnasAberturas } from './aberturas.js';
import useCatalogo from './useCatalogo.js';
import {
  SIGUIENTE_ESTADO,
  cambiarEstadoPedido,
  crearDetalle,
  eliminarDetalle,
  etiquetaEstado,
  listarDetalles,
  obtenerPedido,
} from './pedidos.api.js';
import styles from '../Clientes/ClienteForm.module.css';
import listado from '../Listado.module.css';

/** Pantalla "Detalle de pedido": /pedidos/:id, con sus aberturas. */
export default function DetallePedido() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const { opcionesDiseno, nombresDiseno } = useCatalogo();
  const [venta, setVenta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Acciones: avanzar estado, agregar y quitar detalles.
  const [modalDetalle, setModalDetalle] = useState(false);
  const [aQuitar, setAQuitar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorAccion, setErrorAccion] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const ped = await obtenerPedido(id);
      const [cli, dets, ventas] = await Promise.all([
        obtenerCliente(ped.id_cliente),
        listarDetalles(id),
        api('GET', `/api/ventas/?id_pedido=${id}`),
      ]);
      setPedido(ped);
      setCliente(cli);
      setDetalles(dets);
      setVenta(ventas[0] ?? null);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const pendiente = pedido?.estado === 'pendiente';
  const siguiente = pedido ? SIGUIENTE_ESTADO[pedido.estado] : null;

  const ejecutar = async (accion) => {
    setProcesando(true);
    setErrorAccion(null);
    try {
      await accion();
      await cargar();
      return true;
    } catch (e) {
      setErrorAccion(mensajesDeError(e));
      return false;
    } finally {
      setProcesando(false);
    }
  };

  const avanzarEstado = () =>
    ejecutar(() => cambiarEstadoPedido(id, siguiente.estado));

  const abrirModal = () => {
    setErrorAccion(null);
    setModalDetalle(true);
  };

  const guardarDetalle = async (datos) => {
    const ok = await ejecutar(() => crearDetalle(id, datos));
    if (ok) setModalDetalle(false);
  };

  const quitarDetalle = async () => {
    const ok = await ejecutar(() =>
      eliminarDetalle(id, aQuitar.id_detalle_pedido),
    );
    if (ok) setAQuitar(null);
  };

  const columnas = columnasAberturas(nombresDiseno);

  return (
    <>
      <PageHeader
        title={pedido ? `Pedido #${pedido.id_pedido}` : 'Detalle de pedido'}
        subtitle={cliente ? `Cliente: ${nombreCliente(cliente)}` : undefined}
        icon={<ClipboardList />}
        actions={
          <>
            <Button
              variant="outline"
              icon={<ArrowLeft />}
              onClick={() => navigate('/pedidos')}
            >
              Volver
            </Button>
            {venta ? (
              <Button
                variant="outline"
                icon={<Receipt />}
                onClick={() => navigate(`/ventas-cobros/${venta.id_venta}`)}
              >
                Ver venta
              </Button>
            ) : (
              pedido && (
                <Button
                  variant="outline"
                  icon={<Receipt />}
                  onClick={() =>
                    navigate(`/ventas-cobros/nueva?pedido=${pedido.id_pedido}`)
                  }
                >
                  Registrar venta
                </Button>
              )
            )}
            {siguiente && (
              <Button onClick={avanzarEstado} disabled={procesando}>
                {siguiente.texto}
              </Button>
            )}
          </>
        }
      />

      {cargando && (
        <p className={styles.section} aria-busy="true">
          Cargando pedido...
        </p>
      )}

      {!cargando && error && (
        <div className={styles.errorGeneral} role="alert">
          {error.status === 404 ? 'El pedido no existe.' : error.message}
          {error.status === 403 ? (
            <a href={URL_LOGIN}>Iniciar sesión</a>
          ) : error.status === 404 ? (
            <Link to="/pedidos">Volver al listado</Link>
          ) : (
            <Button variant="outline" onClick={cargar}>
              Reintentar
            </Button>
          )}
        </div>
      )}

      {!cargando && pedido && (
        <div className={styles.form}>
          {errorAccion && !modalDetalle && aQuitar === null && (
            <div className={styles.errorGeneral} role="alert">
              {errorAccion}
            </div>
          )}

          <section className={styles.section} aria-labelledby="sec-datos">
            <h2 id="sec-datos" className={styles.sectionTitle}>
              Datos del pedido
            </h2>
            <dl className={styles.grid}>
              <div>
                <dt>Estado</dt>
                <dd>
                  <StatusTag status={etiquetaEstado(pedido.estado)} />
                </dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{formatFechaHora(pedido.fecha_pedido)}</dd>
              </div>
              <div>
                <dt>Registrado por</dt>
                <dd>Usuario #{pedido.id_usuario}</dd>
              </div>
              <div className={styles.full}>
                <dt>Observaciones</dt>
                <dd>{pedido.observaciones || '—'}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.section} aria-labelledby="sec-detalles">
            <div className={listado.tituloFila}>
              <h2 id="sec-detalles" className={styles.sectionTitle}>
                Productos del pedido
              </h2>
              {pendiente && (
                <Button icon={<Plus />} onClick={abrirModal}>
                  Agregar producto
                </Button>
              )}
            </div>
            <DataTable
              caption="Productos del pedido"
              columns={columnas}
              rows={detalles}
              rowKey="id_detalle_pedido"
              emptyMessage="Este pedido todavía no tiene productos."
              renderActions={
                pendiente
                  ? (fila) => (
                      <RowActions
                        itemName={`producto #${fila.id_detalle_pedido}`}
                        onDelete={() => {
                          setErrorAccion(null);
                          setAQuitar(fila);
                        }}
                      />
                    )
                  : undefined
              }
            />
            {!pendiente && (
              <p>
                Solo un pedido pendiente permite agregar o quitar productos.
              </p>
            )}
          </section>
        </div>
      )}

      <AberturaModal
        open={modalDetalle}
        opcionesDiseno={opcionesDiseno}
        onSubmit={guardarDetalle}
        onCancel={() => setModalDetalle(false)}
        busy={procesando}
        error={errorAccion}
      />

      <ConfirmModal
        open={aQuitar !== null}
        title="Quitar producto"
        message={errorAccion || '¿Querés quitar este producto del pedido?'}
        confirmLabel="Quitar"
        onConfirm={quitarDetalle}
        onCancel={() => {
          setAQuitar(null);
          setErrorAccion(null);
        }}
        busy={procesando}
      />
    </>
  );
}
