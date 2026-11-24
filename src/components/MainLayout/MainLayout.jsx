import { Outlet } from 'react-router';
import Sidebar from '../Sidebar/Sidebar.jsx';

export default function MainLayout({ children, sidebarProps = {} }) {
  return (
    <div className="main-layout">
      <Sidebar {...sidebarProps} />

      <div className="main-layout-body">
        <main className="main-layout-content">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
