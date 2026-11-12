import { cx } from '../_utils/cx.js'
import styles from './IconButton.module.css'

/**
 * Botón que solo muestra un ícono. `label` es obligatorio: va en aria-label y title.
 * tone: "neutral" | "primary" | "success" | "danger"
 */
export default function IconButton({ label, icon, tone = 'neutral', type = 'button', className, ...rest }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(styles.iconButton, styles[tone], className)}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
