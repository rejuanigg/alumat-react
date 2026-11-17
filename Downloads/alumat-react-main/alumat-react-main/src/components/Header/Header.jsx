import { Bell, ChevronDown } from 'lucide-react';

/**
 * Encabezado de ALUMAT.
 *
 * Props:
 * - userName: nombre visible del usuario.
 * - role: rol del usuario.
 * - hasNotifications: muestra el indicador de notificaciones.
 * - onNotifications: función al pulsar la campana.
 * - actions: opciones del desplegable [{ label, onClick }].
 */
export default function Header({
  userName = 'Usuario',
  role = '',
  hasNotifications = false,
  onNotifications,
  actions = [],
}) {
  return (
    <header className="app-header">
      <span className="app-header-title">ALUMAT</span>

      <div className="app-header-actions">
        <button
          type="button"
          className="header-notifications"
          aria-label={
            hasNotifications
              ? 'Notificaciones: hay novedades'
              : 'Notificaciones'
          }
          onClick={onNotifications}
        >
          <Bell className="header-icon" aria-hidden="true" />
          {hasNotifications && (
            <span className="header-notification-dot" aria-hidden="true" />
          )}
        </button>

        <details className="header-user">
          <summary className="header-user-trigger">
            <span className="header-user-info">
              <span className="header-user-name">{userName}</span>
              {role && <span className="header-user-role">{role}</span>}
            </span>
            <ChevronDown className="header-icon" aria-hidden="true" />
          </summary>

          <ul className="header-user-options">
            {actions.length > 0 ? (
              actions.map(({ label, onClick }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="header-user-option"
                    onClick={(event) => {
                      const details = event.currentTarget.closest('details');
                      if (details) details.open = false;
                      onClick?.();
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))
            ) : (
              <li className="header-user-empty">
                No hay opciones disponibles.
              </li>
            )}
          </ul>
        </details>
      </div>
    </header>
  );
}
