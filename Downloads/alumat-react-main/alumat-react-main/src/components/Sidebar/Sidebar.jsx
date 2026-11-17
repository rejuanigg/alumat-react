import { NavLink } from 'react-router';
import {
  Users,
  Package,
  Palette,
  ClipboardList,
  Receipt,
  Wallet,
} from 'lucide-react';

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
 * - onNavigate: función opcional al seleccionar un enlace.
 * - className: clases adicionales para el contenedor.
 *
 * NavLink indica la ruta activa mediante aria-current="page".
 */
export default function Sidebar({
  logo = 'ALUMAT',
  items = enlaces,
  onNavigate,
  className = '',
}) {
  return (
    <aside className={`sidebar ${className}`.trim()}>
      <div className="sidebar-brand">{logo}</div>

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
    </aside>
  );
}
