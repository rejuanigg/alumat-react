import { Eye, Lock, Pencil, Trash2 } from 'lucide-react'
import { cx } from '../_utils/cx.js'
import IconButton from './IconButton.jsx'
import styles from './IconButton.module.css'

const ACCIONES = [
  { prop: 'onView', label: 'Ver', Icono: Eye, tone: 'primary' },
  { prop: 'onEdit', label: 'Editar', Icono: Pencil, tone: 'neutral' },
  { prop: 'onDelete', label: 'Eliminar', Icono: Trash2, tone: 'danger' },
  { prop: 'onBlock', label: 'Bloquear', Icono: Lock, tone: 'neutral' },
]

/**
 * Acciones típicas de una fila. Solo muestra los botones cuyo callback recibe.
 * `itemName` (opcional) completa el aria-label: "Editar Laura Gómez".
 */
export default function RowActions({ onView, onEdit, onDelete, onBlock, itemName, className, ...rest }) {
  const callbacks = { onView, onEdit, onDelete, onBlock }
  const visibles = ACCIONES.filter((a) => callbacks[a.prop])
  if (visibles.length === 0) return null

  return (
    <div
      role="group"
      aria-label={itemName ? `Acciones de ${itemName}` : 'Acciones'}
      className={cx(styles.rowActions, className)}
      {...rest}
    >
      {visibles.map(({ prop, label, Icono, tone }) => (
        <IconButton
          key={prop}
          label={itemName ? `${label} ${itemName}` : label}
          icon={<Icono />}
          tone={tone}
          onClick={callbacks[prop]}
        />
      ))}
    </div>
  )
}
