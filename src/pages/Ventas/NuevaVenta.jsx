import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Plus, Receipt } from 'lucide-react';
import {
  Button,
  DataTable,
  FormField,
  Input,
  PageHeader,
  RowActions,
  SearchSelect,
  Select,
  Textarea,
} from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import { mensajesDeError } from '../../api/errores.js';
import {
  FILTROS_CLIENTE,
  listarClientes,
  nombreCliente,
  opcionesClientes,
} from '../Clientes/clientes.api.js';
import AberturaModal from '../Pedidos/AberturaModal.jsx';
import { columnasAberturas } from '../Pedidos/aberturas.js';
import {
  crearDetalle,
  crearPedido,
  listarDetalles,
  listarPedidos,
} from '../Pedidos/pedidos.api.js';
import useCatalogo from '../Pedidos/useCatalogo.js';
import { crearVenta, listarVentas } from './ventas.api.js';
import styles from '../Clientes/ClienteForm.module.css';
import listado from '../Listado.module.css';

const MODOS = [
  { value: 'nuevo', label: 'Crear un pedido nuevo' },
  { value: 'existente', label: 'Usar un pedido existente' },
];

export default function NuevaVenta() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const pedidoInicial = params.get('pedido') ?? '';

  const { opcionesDiseno, filtrosDiseno, nombresDiseno } = useCatalogo();

  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [modo, setModo] = useState(pedidoInicial ? 'existente' : 'nuevo');
  const [idCliente, setIdCliente] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [idPedido, setIdPedido] = useState(pedidoInicial);
  const [yaCargados, setYaCargados] = useState([]);
  const [cola, setCola] = useState([]);
  const [importe, setImporte] = useState('');
  const [modal, setModal] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [pedidoCreado, setPedidoCreado] = useState(null);

  useEffect(() => {
    Promise.all([listarClientes(), listarPedidos(), listarVentas()])
      .then(([cs, ps, vs]) => {
        setClientes(cs);
        setPedidos(ps);
        setVentas(vs);
      })
      .catch(setErrorCarga)
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (modo !== 'existente' || !idPedido) {
      setYaCargados([]);
      return;
    }
    let vigente = true;
    listarDetalles(idPedido)
      .then((d) => vigente && setYaCargados(d))
      .catch((e) => vigente && setError(e.message));
    return () => {
      vigente = false;
    };
  }, [modo, idPedido]);

  const nombrePorCliente = useMemo(
    () =>
      Object.fromEntries(clientes.map((c) => [c.id_cliente, nombreCliente(c)])),
    [clientes],
  );

  const opcionesCliente = useMemo(() => opcionesClientes(clientes), [clientes]);

  const opcionesPedido = useMemo(() => {
    const vendidos = new Set(ventas.map((v) => v.id_pedido));
    return pedidos
      .filter((p) => !vendidos.has(p.id_pedido))
      .map((p) => ({
        value: String(p.id_pedido),
        label: `Pedido #${p.id_pedido} - ${nombrePorCliente[p.id_cliente] ?? '—'}`,
      }));
  }, [pedidos, ventas, nombrePorCliente]);

  const pedidoElegido = pedidos.find((p) => String(p.id_pedido) === idPedido);

  const admiteProductos =
    modo === 'nuevo' ||
    pedidoCreado !== null ||
    pedidoElegido?.estado === 'pendiente';
  const bloqueado = pedidoCreado !== null;

  const filas = [
    ...yaCargados.map((d) => ({ ...d, clave: `d${d.id_detalle_pedido}` })),
    ...cola,
  ];

  const agregar = (datos) => {
    setCola((c) => [...c, { ...datos, clave: `c${Date.now()}${c.length}` }]);
    setModal(false);
  };

  const quitar = (clave) => setCola((c) => c.filter((f) => f.clave !== clave));

  const registrar = async (evento) => {
    evento.preventDefault();
    setError(null);

    if (modo === 'nuevo' && !pedidoCreado && !idCliente) {
      setError('Elegí el cliente del pedido.');
      return;
    }
    if (modo === 'existente' && !idPedido) {
      setError('Elegí el pedido.');
      return;
    }
    if (filas.length === 0) {
      setError('Agregá al menos un producto a la venta.');
      return;
    }
    if (!(Number(importe) > 0)) {
      setError('Ingresá un importe total mayor a 0.');
      return;
    }

    setEnviando(true);
    let id = modo === 'existente' ? Number(idPedido) : pedidoCreado;
    try {
      if (!id) {
        const pedido = await crearPedido({
          id_cliente: Number(idCliente),
          observaciones: observaciones.trim(),
        });
        id = pedido.id_pedido;
        setPedidoCreado(id);
      }

      for (const item of cola) {
        const { clave, ...datos } = item;
        await crearDetalle(id, datos);
        setCola((c) => c.filter((f) => f.clave !== clave));
        setYaCargados((y) => [...y, { ...datos, id_detalle_pedido: clave }]);
      }
      const venta = await crearVenta({ id_pedido: id, importe_total: importe });
      navigate(`/ventas-cobros/${venta.id_venta}`);
    } catch (e) {
      const aviso = id
        ? ` El pedido #${id} ya quedó creado; al reintentar solo se completa lo que falta.`
        : '';
      setError(mensajesDeError(e) + aviso);
      setEnviando(false);
    }
  };

  const columnas = columnasAberturas(nombresDiseno);

  const sinClientes = !cargando && !errorCarga && opcionesCliente.length === 0;

  return (
    <>
      <PageHeader
        title="Nueva venta"
        subtitle="Armá el pedido con sus productos y registrá la venta."
        icon={<Receipt />}
        actions={
          <Button
            variant="outline"
            icon={<ArrowLeft />}
            onClick={() => navigate('/ventas-cobros')}
          >
            Volver
          </Button>
        }
      />

      {cargando && (
        <p className={styles.section} aria-busy="true">
          Cargando datos...
        </p>
      )}

      {errorCarga && (
        <div className={styles.errorGeneral} role="alert">
          {errorCarga.message}
          {errorCarga.status === 403 && <a href={URL_LOGIN}>Iniciar sesión</a>}
        </div>
      )}

      {!cargando && !errorCarga && (
        <form className={styles.form} onSubmit={registrar} noValidate>
          {error && (
            <div className={styles.errorGeneral} role="alert">
              {error}
            </div>
          )}

          <section className={styles.section} aria-labelledby="sec-pedido">
            <h2 id="sec-pedido" className={styles.sectionTitle}>
              1. Pedido
            </h2>
            <div className={styles.grid}>
              <FormField label="Origen del pedido">
                {(field) => (
                  <Select
                    {...field}
                    options={MODOS}
                    value={modo}
                    disabled={bloqueado}
                    onChange={(e) => {
                      setModo(e.target.value);
                      setCola([]);
                      setError(null);
                    }}
                  />
                )}
              </FormField>

              {modo === 'nuevo' ? (
                <>
                  <FormField
                    label="Cliente"
                    required
                    hint="Solo clientes activos."
                  >
                    {(field) => (
                      <SearchSelect
                        {...field}
                        placeholder="Buscá un cliente"
                        searchPlaceholder="Nombre, DNI/CUIT, teléfono..."
                        options={opcionesCliente}
                        filters={FILTROS_CLIENTE}
                        value={idCliente}
                        disabled={bloqueado}
                        onChange={setIdCliente}
                      />
                    )}
                  </FormField>
                  {sinClientes && (
                    <p className={styles.full} role="status">
                      No hay clientes activos.{' '}
                      <Link to="/clientes/nuevo">Registrá un cliente</Link> o
                      reactivá uno desde <Link to="/clientes">Clientes</Link>.
                    </p>
                  )}
                  <FormField
                    label="Observaciones del pedido (opcional)"
                    className={styles.full}
                  >
                    {(field) => (
                      <Textarea
                        {...field}
                        rows={2}
                        value={observaciones}
                        disabled={bloqueado}
                        onChange={(e) => setObservaciones(e.target.value)}
                      />
                    )}
                  </FormField>
                </>
              ) : (
                <FormField
                  label="Pedido"
                  required
                  hint="Solo pedidos que todavía no tienen venta."
                >
                  {(field) => (
                    <SearchSelect
                      {...field}
                      placeholder="Buscá un pedido"
                      searchPlaceholder="N° de pedido o cliente..."
                      options={opcionesPedido}
                      value={idPedido}
                      disabled={bloqueado}
                      onChange={(v) => {
                        setIdPedido(v);
                        setCola([]);
                      }}
                    />
                  )}
                </FormField>
              )}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="sec-productos">
            <div className={listado.tituloFila}>
              <h2 id="sec-productos" className={styles.sectionTitle}>
                2. Productos
              </h2>
              <Button
                icon={<Plus />}
                onClick={() => setModal(true)}
                disabled={!admiteProductos || enviando}
              >
                Agregar producto
              </Button>
            </div>
            <DataTable
              caption="Productos de la venta"
              columns={columnas}
              rows={filas}
              rowKey="clave"
              emptyMessage="Todavía no agregaste productos."
              renderActions={(fila) =>
                fila.clave.startsWith('c') ? (
                  <RowActions
                    itemName="producto"
                    onDelete={() => quitar(fila.clave)}
                  />
                ) : null
              }
            />
            {!admiteProductos && (
              <p>
                Este pedido no está pendiente: no admite productos nuevos. Se
                vende con los que ya tiene.
              </p>
            )}
          </section>

          <section className={styles.section} aria-labelledby="sec-importe">
            <h2 id="sec-importe" className={styles.sectionTitle}>
              3. Importe
            </h2>
            <div className={styles.grid}>
              <FormField
                label="Importe total"
                required
                hint="Los productos no tienen precio cargado: ingresá el total acordado."
              >
                {(field) => (
                  <Input
                    {...field}
                    type="number"
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    value={importe}
                    onChange={(e) => setImporte(e.target.value)}
                  />
                )}
              </FormField>
            </div>
          </section>

          <div className={styles.actions}>
            <Button
              variant="outline"
              onClick={() => navigate('/ventas-cobros')}
              disabled={enviando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Registrando...' : 'Registrar venta'}
            </Button>
          </div>
        </form>
      )}

      <AberturaModal
        open={modal}
        opcionesDiseno={opcionesDiseno}
        filtrosDiseno={filtrosDiseno}
        onSubmit={agregar}
        onCancel={() => setModal(false)}
      />
    </>
  );
}
