import { useEffect, useId, useRef } from 'react';
import Button from '../Button/index.js';

/**
 * Confirmación modal mediante dialog nativo.
 *
 * Props:
 * - open: indica si debe mostrarse.
 * - title: título de la confirmación.
 * - message: explicación de la acción.
 * - onConfirm: función al confirmar.
 * - onCancel: función que debe actualizar open a false.
 * - confirmLabel / cancelLabel: textos de los botones.
 * - busy: bloquea las acciones mientras se procesa la operación.
 *
 * La página controla open y cierra el modal al finalizar.
 */
export default function ConfirmModal({
  open = false,
  title = 'Confirmar eliminación',
  message = '¿Querés eliminar este registro?',
  onConfirm,
  onCancel,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  busy = false,
}) {
  const dialogRef = useRef(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-modal"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-message`}
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel?.();
      }}
    >
      <div className="confirm-modal-body">
        <h2 id={`${id}-title`}>{title}</h2>
        <p id={`${id}-message`}>{message}</p>

        <div className="confirm-modal-actions">
          <Button
            variant="outline"
            autoFocus
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={busy || !onConfirm}
          >
            {busy ? 'Procesando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
