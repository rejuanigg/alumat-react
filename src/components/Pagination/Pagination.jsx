import Button from '../Button/index.js';

/**
 * Paginación controlada por la página.
 *
 * Props:
 * - page: página actual, comenzando en 1.
 * - pageSize: registros por página; entero mayor que 0.
 * - total: cantidad total de registros; entero mayor o igual a 0.
 * - onPageChange: recibe el número de la nueva página.
 * - disabled: deshabilita la navegación.
 *
 * La página que lo usa debe seleccionar los registros que muestra.
 */
export default function Pagination({
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  disabled = false,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);
  const navigationDisabled = disabled || !onPageChange;

  return (
    <div className="pagination">
      <p className="pagination-summary" role="status">
        Mostrando {from} a {to} de {total}
      </p>

      <nav className="pagination-controls" aria-label="Paginación">
        <Button
          variant="outline"
          disabled={navigationDisabled || currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          Anterior
        </Button>

        <span className="pagination-current">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={navigationDisabled || currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          Siguiente
        </Button>
      </nav>
    </div>
  );
}
