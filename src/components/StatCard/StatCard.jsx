const VARIANTS = ['clients', 'products', 'orders', 'sales'];

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
