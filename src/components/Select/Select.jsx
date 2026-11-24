import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';
import { cx } from '../_utils/cx.js';
import inputStyles from '../Input/Input.module.css';
import styles from './Select.module.css';

const Select = forwardRef(function Select(
  { options = [], placeholder, invalid, className, ...rest },
  ref,
) {
  const esInvalido = Boolean(invalid || rest['aria-invalid']);
  return (
    <span className={cx(styles.wrapper, className)}>
      <select
        ref={ref}
        className={cx(
          inputStyles.control,
          styles.select,
          esInvalido && inputStyles.invalid,
        )}
        {...rest}
        aria-invalid={esInvalido || undefined}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.chevron} aria-hidden="true" />
    </span>
  );
});

export default Select;
