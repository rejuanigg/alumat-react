import { cx } from '../_utils/cx.js'
import styles from './Badge.module.css'

/**
 * Etiqueta chica de texto. El significado va siempre en el texto (children),
 * el color solo acompaña.
 * tone: "success" | "danger" | "warning" | "info" | "accent" | "neutral"
 */
export default function Badge({ tone = 'neutral', children, className, ...rest }) {
  return (
    <span className={cx(styles.badge, styles[tone] ?? styles.neutral, className)} {...rest}>
      {children}
    </span>
  )
}
