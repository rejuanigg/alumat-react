import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Plus, Printer, Receipt } from 'lucide-react';
import {
  Button,
  FormField,
  Input,
  PageHeader,
  Select,
} from '../../components';
import { URL_LOGIN } from '../../api/client.js';
import { mensajesDeError } from '../../api/errores.js';
import { formatMoneda } from '../Cajas/formatos.js';
import ModalFormulario from '../Cajas/ModalFormulario.jsx';
import {
  METODOS_PAGO,
  TIPOS_COBRO,
  aperturaAbierta,
  listarCobros,
  obtenerVenta,
  registrarCobro,
} from './ventas.api.js';
import { listarDetalles, obtenerPedido } from '../Pedidos/pedidos.api.js';
import { obtenerCliente } from '../Clientes/clientes.api.js';
import Boleta from './Boleta.jsx';
import useCatalogo from '../Pedidos/useCatalogo.js';
import styles from '../Clientes/ClienteForm.module.css';

const COBRO_VACIO = {
  tipo_cobro: 'parcial',
  metodo_pago: 'efectivo',
  monto: '',
};

export default function DetalleVenta() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venta, setVenta] = useState(null);
  const [cobros, setCobros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cliente, setCliente] = useState(null);
  const { nombresDiseno } = useCatalogo();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(COBRO_VACIO);
  const [apertura, setApertura] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorModal, setErrorModal] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [v, cs] = await Promise.all([obtenerVenta(id), listarCobros(id)]);
      const [dets, pedido] = await Promise.all([
        listarDetalles(v.id_pedido),
        obtenerPedido(v.id_pedido),
      ]);
      const cli = await obtenerCliente(pedido.id_cliente).catch(() => null);
      setCliente(cli);
      setVenta(v);
      setCobros(cs);
      setProductos(dets);
    } catch (e) {
      setError(e);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const saldo = venta ? Number(venta.saldo_pendiente) : 0;

  const abrirModal = async () => {
    setForm({ ...COBRO_VACIO, monto: String(saldo) });
    setErrorModal(null);
    setModal(true);
    try {
      setApertura(await aperturaAbierta());
    } catch {
      setApertura(null);
    }
  };

  const cambiar = (campo) => (e) => {
    const valor = e.target.value;
    setForm((f) => {
      const nuevo = { ...f, [campo]: valor };

      if (campo === 'tipo_cobro' && valor === 'total')
        nuevo.monto = String(saldo);
      return nuevo;
    });
  };

  const esEfectivo = form.metodo_pago === 'efectivo';

  const guardar = async () => {
    if (!(Number(form.monto) > 0)) {
      setErrorModal('Ingresá un monto mayor a 0.');
      return;
    }
    if (esEfectivo && !apertura) {
      setErrorModal(
        'Para cobrar en efectivo tiene que haber una caja abierta. Abrila en Cajas.',
      );
      return;
    }
    setEnviando(true);
    setErrorModal(null);
    try {
      await registrarCobro({
        id_venta: Number(id),
        monto: form.monto,
        tipo_cobro: form.tipo_cobro,
        metodo_pago: form.metodo_pago,
        ...(esEfectivo ? { id_apertura: apertura.id_apertura } : {}),
      });
      await cargar();
      setModal(false);
    } catch (e) {
      setErrorModal(mensajesDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader
        title={venta ? `Venta #${venta.id_venta}` : 'Detalle de venta'}
        subtitle={venta ? `Pedido #${venta.id_pedido}` : undefined}
        icon={<Receipt />}
        actions={
          <>
            <Button
              variant="outline"
              icon={<ArrowLeft />}
              onClick={() => navigate('/ventas-cobros')}
            >
              Volver
            </Button>
            {venta && (
              <Button
                variant="outline"
                onClick={() => navigate(`/pedidos/${venta.id_pedido}`)}
              >
                Ver pedido
              </Button>
            )}
            {venta && (
              <Button
                variant="outline"
                icon={<Printer />}
                onClick={() => window.print()}
              >
                Imprimir boleta
              </Button>
            )}
            {venta && (
              <Button
                icon={<Plus />}
                onClick={abrirModal}
                disabled={saldo === 0}
              >
                Registrar cobro
              </Button>
            )}
          </>
        }
      />

      {cargando && (
        <p className={styles.section} aria-busy="true">
          Cargando venta...
        </p>
      )}

      {!cargando && error && (
        <div className={styles.errorGeneral} role="alert">
          {error.status === 404 ? 'La venta no existe.' : error.message}
          {error.status === 403 ? (
            <a href={URL_LOGIN}>Iniciar sesión</a>
          ) : error.status === 404 ? (
            <Link to="/ventas-cobros">Volver al listado</Link>
          ) : (
            <Button variant="outline" onClick={cargar}>
              Reintentar
            </Button>
          )}
        </div>
      )}

      {!cargando && venta && (
        <>
          <Boleta
            venta={venta}
            cliente={cliente}
            productos={productos}
            cobros={cobros}
            nombresDiseno={nombresDiseno}
          />
          <p>
            Los cobros no se modifican ni se borran. Los cobros en efectivo
            generan una entrada en la caja abierta.
          </p>
        </>
      )}

      <ModalFormulario
        open={modal}
        title="Registrar cobro"
        submitLabel="Registrar cobro"
        onSubmit={guardar}
        onCancel={() => setModal(false)}
        busy={enviando}
        error={errorModal}
      >
        <p>Saldo pendiente: {formatMoneda(saldo)}.</p>
        <FormField label="Tipo de cobro" required>
          {(field) => (
            <Select
              {...field}
              options={TIPOS_COBRO}
              value={form.tipo_cobro}
              onChange={cambiar('tipo_cobro')}
            />
          )}
        </FormField>
        <FormField label="Método de pago" required>
          {(field) => (
            <Select
              {...field}
              options={METODOS_PAGO}
              value={form.metodo_pago}
              onChange={cambiar('metodo_pago')}
            />
          )}
        </FormField>
        <FormField label="Monto" required>
          {(field) => (
            <Input
              {...field}
              type="number"
              min="0.01"
              max={saldo}
              step="0.01"
              inputMode="decimal"
              value={form.monto}
              onChange={cambiar('monto')}
              readOnly={form.tipo_cobro === 'total'}
            />
          )}
        </FormField>
        <p>El número de boleta se genera automáticamente.</p>
        {esEfectivo && (
          <p>
            {apertura
              ? `Se registrará como entrada en la apertura #${apertura.id_apertura}.`
              : 'No hay una caja abierta: abrila en Cajas para cobrar en efectivo.'}
          </p>
        )}
      </ModalFormulario>
    </>
  );
}
