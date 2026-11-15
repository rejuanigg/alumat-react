import { useId } from 'react';

/**
 * Tarjeta reutilizable para productos o diseños.
 *
 * Props:
 * - title: nombre del producto o diseño.
 * - description: descripción opcional.
 * - imageSrc: dirección de la imagen, opcional.
 * - imageAlt: descripción de la imagen; vacío si es decorativa.
 * - badge: elemento Badge o StatusTag opcional.
 * - actions: botones de acción opcionales.
 */
export default function ProductCard({
  title,
  description,
  imageSrc,
  imageAlt = '',
  badge,
  actions,
}) {
  const titleId = useId();

  return (
    <article className="product-card" aria-labelledby={titleId}>
      <div className="product-card-media">
        {imageSrc ? (
          <img
            className="product-card-image"
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
          />
        ) : (
          <span className="product-card-placeholder">Sin imagen</span>
        )}
      </div>

      <div className="product-card-body">
        {badge && <div>{badge}</div>}

        <h3 id={titleId} className="product-card-title">
          {title}
        </h3>

        {description && (
          <p className="product-card-description">{description}</p>
        )}

        {actions && <div className="product-card-actions">{actions}</div>}
      </div>
    </article>
  );
}
