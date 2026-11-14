import { forwardRef } from 'react';
import { cx } from '../_utils/cx.js';
import styles from './Input.module.css';

/** Campo de texto. `invalid` (o aria-invalid) muestra el estilo de error. */
const Input = forwardRef(function Input(
  { invalid, type = 'text', className, ...rest },
  ref,
) {
  const esInvalido = Boolean(invalid || rest['aria-invalid']);
  return (
    <input
      ref={ref}
      type={type}
      className={cx(styles.control, esInvalido && styles.invalid, className)}
      {...rest}
      aria-invalid={esInvalido || undefined}
    />
  );
});

export default Input;
