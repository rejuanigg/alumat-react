const VARIANTS = ['clients', 'products', 'orders', 'sales'];

/**
 * Tarjeta de indicador.
 *
 * Props:
 * - title: nombre del indicador.
 * - value: valor que se muestra, como número o texto.
 * - icon: elemento de ícono opcional.
 * - variant: "clients", "products", "orders" o "sales".
 * - description: aclaración opcional debajo del valor.
 */
export default function StatCard({
  title,
  value,
  icon,
  variant = 'clients',
  description,
}) {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'clients';

  return (
    <div className={`stat-card stat-card--${safeVariant}`}>
      {icon && (
        <span className="stat-card-icon" aria-hidden="true">
          {icon}
        </span>
      )}

      <dl className="stat-card-data">
        <dt className="stat-card-title">{title}</dt>
        <dd className="stat-card-value">{value}</dd>
      </dl>

      {description && <p className="stat-card-description">{description}</p>}
    </div>
  );
}
