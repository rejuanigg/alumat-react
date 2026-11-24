import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import MainLayout from '../components/MainLayout/MainLayout.jsx';
import useSesion from './useSesion.js';

export default function RutaProtegida() {
  const { estado, usuario, perfil, salir } = useSesion();
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
      sidebarProps={{
        user: {
          name: perfil?.username || usuario || 'Usuario',
          role: perfil?.rol ? `Rol: ${perfil.rol}` : undefined,
          actions: [{ label: 'Cerrar sesión', onClick: cerrar }],
        },
      }}
    />
  );
}
