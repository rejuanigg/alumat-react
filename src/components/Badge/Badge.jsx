import { cx } from '../_utils/cx.js';
import styles from './Badge.module.css';

export default function Badge({
  tone = 'neutral',
  children,
  className,
  ...rest
}) {
  return (
    <span
      className={cx(styles.badge, styles[tone] ?? styles.neutral, className)}
      {...rest}
    >
      {children}
    </span>
  );
}
