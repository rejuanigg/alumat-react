import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ClipboardList,
  House,
  Package,
  Plus,
  Users,
  Wallet,
} from 'lucide-react';
import { Button, PageHeader, StatCard, StatusTag } from '../../components';
import { api } from '../../api/client.js';
import styles from './Inicio.module.css';

const ACCESOS = [
  { to: '/clientes/nuevo', label: 'Nuevo cliente' },
  { to: '/productos/nuevo', label: 'Nuevo producto' },
  { to: '/disenos/nuevo', label: 'Nuevo diseño' },
  { to: '/cajas', label: 'Ir a la caja' },
];

/**
 * Pantalla de inicio: resumen con datos de la API.
 * Cada consulta es independiente: si una falla, las demás se siguen mostrando.
 */
export default function Inicio() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const [clientes, productos, pedidos, aperturas] = await Promise.allSettled([
      api('GET', '/api/clientes/?activo=true'),
      api('GET', '/api/productos/?activo=true'),
      api('GET', '/api/pedidos/'),
      api('GET', '/api/aperturas/?estado=abierta'),
    ]);
    setDatos({ clientes, productos, pedidos, aperturas });
    setCargando(false);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Valor de una consulta, o "—" si todavía carga o falló.
  const valor = (resultado, transformar) =>
    cargando || resultado?.status !== 'fulfilled'
      ? '—'
      : transformar(resultado.value);

  const fallo =
    datos && Object.values(datos).some((r) => r.status === 'rejected');
  const cajaAbierta =
    datos?.aperturas.status === 'fulfilled' && datos.aperturas.value.length > 0;

  return (
    <>
      <PageHeader
        title="Inicio"
        subtitle="Resumen general de ALUMAT."
        icon={<House />}
      />

      <section className={styles.page} aria-busy={cargando}>
        {fallo && (
          <div className={styles.aviso} role="alert">
            No se pudieron cargar algunos datos.{' '}
            <Button variant="outline" onClick={cargar}>
              Reintentar
            </Button>
          </div>
        )}

        <div className={styles.stats}>
          <StatCard
            title="Clientes activos"
            value={valor(datos?.clientes, (l) => l.length)}
            icon={<Users />}
            variant="clients"
          />
          <StatCard
            title="Productos activos"
            value={valor(datos?.productos, (l) => l.length)}
            icon={<Package />}
            variant="products"
          />
          <StatCard
            title="Pedidos pendientes"
            value={valor(
              datos?.pedidos,
              (l) => l.filter((p) => p.estado === 'pendiente').length,
            )}
            icon={<ClipboardList />}
            variant="orders"
          />
          <StatCard
            title="Pedidos en proceso"
            value={valor(
              datos?.pedidos,
              (l) => l.filter((p) => p.estado === 'en_proceso').length,
            )}
            icon={<ClipboardList />}
            variant="sales"
          />
        </div>

        <section className={styles.section} aria-labelledby="sec-caja">
          <h2 id="sec-caja" className={styles.sectionTitle}>
            Caja
          </h2>
          <p>
            {datos && datos.aperturas.status === 'fulfilled' ? (
              <>
                <StatusTag status={cajaAbierta ? 'Abierta' : 'Cerrada'} />{' '}
                {cajaAbierta
                  ? 'Hay una apertura de caja en curso.'
                  : 'No hay una apertura en curso.'}
              </>
            ) : (
              '—'
            )}
          </p>
          <div>
            <Button
              variant="outline"
              icon={<Wallet />}
              onClick={() => navigate('/cajas')}
            >
              Ver caja
            </Button>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="sec-accesos">
          <h2 id="sec-accesos" className={styles.sectionTitle}>
            Accesos rápidos
          </h2>
          <div className={styles.accesos}>
            {ACCESOS.map(({ to, label }) => (
              <Button
                key={to}
                variant="outline"
                icon={<Plus />}
                onClick={() => navigate(to)}
              >
                {label}
              </Button>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
