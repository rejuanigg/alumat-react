import Badge from '../Badge/Badge.jsx';
import styles from './StatusTag.module.css';
import { STATUS_TONES } from './statusTones.js';

/** Muestra un estado ("Activo", "Pendiente", …) con el tono que le corresponde. */
export default function StatusTag({ status, ...rest }) {
  return (
    <Badge tone={STATUS_TONES[status] ?? 'neutral'} {...rest}>
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </Badge>
  );
}
