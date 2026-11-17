import { NavLink } from 'react-router';
import {
  Users,
  Package,
  Palette,
  ClipboardList,
  Receipt,
  Wallet,
  CircleUser,
} from 'lucide-react';
import Logo from '../../icon.png';

const enlaces = [
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/productos', label: 'Productos', icon: Package },
  { to: '/disenos', label: 'Diseños', icon: Palette },
  { to: '/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/ventas-cobros', label: 'Ventas y cobros', icon: Receipt },
  { to: '/cajas', label: 'Cajas', icon: Wallet },
];

/**
 * Menú lateral de ALUMAT. Debe usarse dentro de BrowserRouter.
 *
 * Props:
 * - logo: contenido de marca; por defecto, "ALUMAT".
 * - items: lista de objetos { to, label, icon }.
 *   icon es un componente de ícono opcional.
 * - user: usuario opcional { name, role, actions: [{ label, onClick }] }.
 *   Se muestra al pie con su ícono y un desplegable de opciones.
 * - onNavigate: función opcional al seleccionar un enlace.
 * - className: clases adicionales para el contenedor.
 *
 * NavLink indica la ruta activa mediante aria-current="page".
 */
export default function Sidebar({
  logo = Logo,
  items = enlaces,
  user,
  onNavigate,
  className = '',
}) {
  return (
    <aside className={`sidebar ${className}`.trim()}>
      <NavLink to="/" className="sidebar-brand">
        <img src={logo} alt="ALUMAT" />
      </NavLink>

      <nav aria-label="Navegación principal">
        <ul className="sidebar-menu">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} className="sidebar-link" onClick={onNavigate}>
                {Icon && <Icon className="sidebar-icon" aria-hidden="true" />}
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {user && (
        <details className="sidebar-user">
          <summary className="sidebar-user-trigger">
            <CircleUser className="sidebar-user-icon" aria-hidden="true" />
            <span className="sidebar-user-info">
              <span className="sidebar-user-name">{user.name}</span>
              {user.role && (
                <span className="sidebar-user-role">{user.role}</span>
              )}
            </span>
          </summary>

          <ul className="sidebar-user-options">
            {(user.actions ?? []).map(({ label, onClick }) => (
              <li key={label}>
                <button
                  type="button"
                  className="sidebar-user-option"
                  onClick={(event) => {
                    const details = event.currentTarget.closest('details');
                    if (details) details.open = false;
                    onClick?.();
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </aside>
  );
}
