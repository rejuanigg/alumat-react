/**
 * Encabezado de una página.
 *
 * Props:
 * - title: título principal.
 * - subtitle: descripción opcional.
 * - icon: elemento de ícono opcional, por ejemplo <Users />.
 * - actions: botones u otros controles opcionales.
 */
export default function PageHeader({ title, subtitle, icon, actions }) {
  return (
    <div className="page-header">
      <div className="page-header-info">
        {icon && (
          <span className="page-header-icon" aria-hidden="true">
            {icon}
          </span>
        )}

        <div>
          <h1>{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
      </div>

      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
