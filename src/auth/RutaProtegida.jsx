import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import MainLayout from '../components/MainLayout/MainLayout.jsx';
import useSesion from './useSesion.js';

/**
 * Layout de las pantallas que requieren sesión. Si no hay sesión, manda
 * al login y guarda en ?next= a dónde volver después de ingresar.
 */
export default function RutaProtegida() {
  const { estado, usuario, salir } = useSesion();
  const location = useLocation();
  const navigate = useNavigate();

  if (estado === 'verificando') {
    return (
      <main className="app-placeholder" aria-busy="true">
        <p>Verificando sesión...</p>
      </main>
    );
  }

  if (estado === 'anonimo') {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  const cerrar = async () => {
    await salir();
    navigate('/login', { replace: true });
  };

  return (
    <MainLayout
      headerProps={{
        userName: usuario || 'Usuario',
        actions: [{ label: 'Cerrar sesión', onClick: cerrar }],
      }}
    />
  );
}
