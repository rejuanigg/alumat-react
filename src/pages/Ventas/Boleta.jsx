import { cx } from '../../components/_utils/cx.js';
import Logo from '../../icon.png';
import Letters from '../../letters.png';
import { EMPRESA } from '../../config/empresa.js';
import { nombreCliente } from '../Clientes/clientes.api.js';
import { formatFechaHora, formatMoneda } from '../Cajas/formatos.js';
import {
  COLORES_ALUMINIO,
  TIPOS_REVESTIMIENTO,
  TIPOS_VIDRIO,
  etiquetaDe,
} from '../Pedidos/pedidos.api.js';
import { etiquetaMetodo } from './ventas.api.js';
import styles from './Boleta.module.css';

const numero = (n, largo) => String(n).padStart(largo, '0');

function Dato({ etiqueta, valor }) {
  if (!valor) return null;
  return (
    <p className={styles.dato}>
      <span className={styles.etiqueta}>{etiqueta}</span> {valor}
    </p>
  );
}

export default function Boleta({
  venta,
  cliente,
  productos,
  cobros,
  nombresDiseno,
}) {
  const saldo = Number(venta.saldo_pendiente);
  const unidades = productos.reduce((t, p) => t + Number(p.cantidad), 0);
  const ubicacion = [EMPRESA.direccion, EMPRESA.localidad]
    .filter(Boolean)
    .join(', ');
  const documento =
    cliente &&
    (cliente.tipo_cliente === 'empresa'
      ? cliente.cuit && `CUIT ${cliente.cuit}`
      : cliente.dni && `DNI ${cliente.dni}`);

  return (
    <article className={styles.boleta} aria-label={`Boleta de venta ${venta.id_venta}`}>
      <header className={styles.cabecera}>
        <div className={styles.empresa}>
          <div className={styles.marca}>
            <img src={Logo} alt="" className={styles.logo} />
            <img src={Letters} alt={EMPRESA.nombre} className={styles.letras} />
          </div>
          <Dato etiqueta="Razón social:" valor={EMPRESA.razonSocial} />
          <Dato etiqueta="Domicilio:" valor={ubicacion} />
          <Dato etiqueta="Teléfono:" valor={EMPRESA.telefono} />
          <Dato etiqueta="Correo:" valor={EMPRESA.correo} />
          <Dato etiqueta="Instagram:" valor={EMPRESA.instagram} />
          <Dato etiqueta="Facebook:" valor={EMPRESA.facebook} />
        </div>

        <div className={styles.comprobante}>
          <h2 className={styles.titulo}>BOLETA</h2>
          <p className={styles.numero}>N.º {numero(venta.id_venta, 8)}</p>
          <Dato etiqueta="Fecha:" valor={formatFechaHora(venta.fecha_venta)} />
          <Dato etiqueta="Pedido:" valor={`#${venta.id_pedido}`} />
          <Dato etiqueta="CUIT:" valor={EMPRESA.cuit} />
          <Dato etiqueta="Condición IVA:" valor={EMPRESA.condicionIva} />
          <Dato etiqueta="Ing. Brutos:" valor={EMPRESA.ingresosBrutos} />
          <Dato
            etiqueta="Inicio de actividades:"
            valor={EMPRESA.inicioActividades}
          />
        </div>
      </header>

      <section className={styles.bloque} aria-labelledby="bol-cliente">
        <h3 id="bol-cliente" className={styles.subtitulo}>
          Cliente
        </h3>
        {cliente ? (
          <div className={styles.columnas}>
            <Dato etiqueta="Nombre:" valor={nombreCliente(cliente)} />
            <Dato etiqueta="Documento:" valor={documento} />
            <Dato etiqueta="Teléfono:" valor={cliente.telefono} />
            <Dato etiqueta="Correo:" valor={cliente.correo_electronico} />
            <Dato etiqueta="Dirección:" valor={cliente.direccion} />
          </div>
        ) : (
          <p className={styles.dato}>Sin datos del cliente.</p>
        )}
      </section>

      <section className={styles.bloque} aria-labelledby="bol-detalle">
        <h3 id="bol-detalle" className={styles.subtitulo}>
          Detalle
        </h3>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Cant.</th>
              <th>Descripción</th>
              <th>Medidas</th>
              <th>Terminación</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 && (
              <tr>
                <td colSpan={4}>El pedido no tiene productos.</td>
              </tr>
            )}
            {productos.map((p) => {
              const terminacion = [
                etiquetaDe(COLORES_ALUMINIO, p.color_aluminio),
                p.tipo_vidrio && `vidrio ${etiquetaDe(TIPOS_VIDRIO, p.tipo_vidrio)}`,
                p.tipo_revestimiento &&
                  etiquetaDe(TIPOS_REVESTIMIENTO, p.tipo_revestimiento),
              ]
                .filter(Boolean)
                .join(' · ');
              return (
                <tr key={p.id_detalle_pedido}>
                  <td>{p.cantidad}</td>
                  <td>
                    {nombresDiseno[p.id_diseno] ?? `Diseño #${p.id_diseno}`}
                    {p.observaciones && (
                      <span className={styles.nota}>{p.observaciones}</span>
                    )}
                  </td>
                  <td>
                    {p.ancho} × {p.alto}
                  </td>
                  <td>{terminacion || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className={styles.pie}>
          {productos.length} {productos.length === 1 ? 'ítem' : 'ítems'} ·{' '}
          {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
        </p>
      </section>

      {cobros.length > 0 && (
        <section className={styles.bloque} aria-labelledby="bol-cobros">
          <h3 id="bol-cobros" className={styles.subtitulo}>
            Pagos recibidos
          </h3>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Recibo</th>
                <th>Método</th>
                <th className={styles.der}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {cobros.map((c) => (
                <tr key={c.id_cobro}>
                  <td>{formatFechaHora(c.fecha_cobro)}</td>
                  <td>{c.numero_boleta}</td>
                  <td>
                    {etiquetaMetodo(c.metodo_pago)} (
                    {c.tipo_cobro === 'total' ? 'total' : 'parcial'})
                  </td>
                  <td className={styles.der}>{formatMoneda(c.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className={styles.totales} aria-label="Totales">
        <dl>
          <div className={styles.fila}>
            <dt>Total cobrado</dt>
            <dd>{formatMoneda(venta.total_cobrado)}</dd>
          </div>
          <div className={styles.fila}>
            <dt>Saldo pendiente</dt>
            <dd>{formatMoneda(venta.saldo_pendiente)}</dd>
          </div>
          <div className={cx(styles.fila, styles.importe)}>
            <dt>IMPORTE TOTAL</dt>
            <dd>{formatMoneda(venta.importe_total)}</dd>
          </div>
        </dl>
        <p className={saldo === 0 ? styles.pagada : styles.conSaldo}>
          {saldo === 0 ? 'PAGADA' : 'CON SALDO PENDIENTE'}
        </p>
      </section>

      <footer className={styles.legal}>
        <p>Gracias por su compra.</p>
        {EMPRESA.leyenda && <p>{EMPRESA.leyenda}</p>}
      </footer>
    </article>
  );
}

