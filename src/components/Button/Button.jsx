import { cx } from '../_utils/cx.js';
import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  icon,
  children,
  type = 'button',
  className,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], className)}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}
