import { useEffect, useId, useRef } from 'react';
import { Button } from '../../components';

/**
 * Modal con un formulario (dialog nativo, mismo estilo que ConfirmModal).
 * La página controla `open`, `busy` y `error`; onCancel debe poner open en false.
 */
export default function ModalFormulario({
  open,
  title,
  children,
  submitLabel = 'Guardar',
  onSubmit,
  onCancel,
  busy = false,
  error = null,
}) {
  const dialogRef = useRef(null);
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-modal"
      aria-labelledby={`${id}-title`}
      aria-busy={busy}
      onCancel={(evento) => {
        evento.preventDefault();
        if (!busy) onCancel?.();
      }}
    >
      <form
        className="confirm-modal-body"
        onSubmit={(evento) => {
          evento.preventDefault();
          onSubmit?.();
        }}
        noValidate
      >
        <h2 id={`${id}-title`}>{title}</h2>
        {children}
        {error && <p role="alert">{error}</p>}
        <div className="confirm-modal-actions">
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? 'Procesando...' : submitLabel}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
