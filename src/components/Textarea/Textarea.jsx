import { forwardRef } from 'react';
import { cx } from '../_utils/cx.js';
import inputStyles from '../Input/Input.module.css';
import styles from './Textarea.module.css';

/** Texto de varias líneas. `invalid` (o aria-invalid) muestra el estilo de error. */
const Textarea = forwardRef(function Textarea(
  { invalid, rows = 4, className, ...rest },
  ref,
) {
  const esInvalido = Boolean(invalid || rest['aria-invalid']);
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx(
        inputStyles.control,
        styles.textarea,
        esInvalido && inputStyles.invalid,
        className,
      )}
      {...rest}
      aria-invalid={esInvalido || undefined}
    />
  );
});

export default Textarea;
