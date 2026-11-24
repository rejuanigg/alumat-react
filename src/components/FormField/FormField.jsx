import { AlertCircle } from 'lucide-react';
import { useId } from 'react';
import { cx } from '../_utils/cx.js';
import styles from './FormField.module.css';

export default function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  className,
  ...rest
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const control = children({
    id,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  });

  return (
    <div className={cx(styles.field, className)} {...rest}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {control}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className={styles.error}>
          <AlertCircle className={styles.errorIcon} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
