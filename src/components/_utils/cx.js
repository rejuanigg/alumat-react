/** Une nombres de clase, ignorando los vacíos: cx('a', cond && 'b'). */
export const cx = (...clases) => clases.filter(Boolean).join(' ')
