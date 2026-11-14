import { Outlet } from 'react-router';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Header from '../Header/Header.jsx';

/**
 * Estructura principal. Debe usarse dentro de BrowserRouter.
 *
 * Props:
 * - children: contenido de la página. Si se omite, muestra Outlet.
 * - sidebarProps: propiedades que recibe Sidebar.
 * - headerProps: propiedades que recibe Header.
 */
export default function MainLayout({
  children,
  sidebarProps = {},
  headerProps = {},
}) {
  return (
    <div className="main-layout">
      <Sidebar {...sidebarProps} />

      <div className="main-layout-body">
        <Header {...headerProps} />

        <main className="main-layout-content">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
