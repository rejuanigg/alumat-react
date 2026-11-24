import { cx } from '../_utils/cx.js';
import styles from './IconButton.module.css';

export default function IconButton({
  label,
  icon,
  tone = 'neutral',
  type = 'button',
  className,
  ...rest
}) {
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
  );
}
