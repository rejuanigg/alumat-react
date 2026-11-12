import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'
import { cx } from '../_utils/cx.js'
import styles from './Select.module.css'

/**
 * Lista desplegable nativa.
 * options: [{ value, label }]. `placeholder` agrega una primera opción vacía.
 */
const Select = forwardRef(function Select({ options = [], placeholder, invalid, className, ...rest }, ref) {
  const esInvalido = Boolean(invalid || rest['aria-invalid'])
  return (
    <span className={cx(styles.wrapper, className)}>
      <select
        ref={ref}
        className={cx(styles.select, esInvalido && styles.invalid)}
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
  )
})

export default Select
