import { Outlet } from 'react-router';
import Sidebar from '../Sidebar/Sidebar.jsx';

/**
 * Estructura principal. Debe usarse dentro de BrowserRouter.
 *
 * Props:
 * - children: contenido de la página. Si se omite, muestra Outlet.
 * - sidebarProps: propiedades que recibe Sidebar.
 */
export default function MainLayout({
  children,
  sidebarProps = {},
}) {
  return (
    <div className="main-layout">
      <Sidebar {...sidebarProps} />

      <div className="main-layout-body">
        <main className="main-layout-content">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
