import { Download, Pencil, Plus, Save, Star, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Badge, Button, FormField, IconButton, Input, RowActions, Select, StatusTag, Textarea } from '../components'
import styles from './ComponentsPreview.module.css'
import {
  BADGE_TONES,
  BUTTON_VARIANTS,
  FORM_INICIAL,
  ICON_BUTTON_TONES,
  ITEM_DEMO,
  LINEAS,
  ORDEN_CAMPOS,
  STATUSES,
  UNKNOWN_STATUS,
  validarFormulario,
} from './componentsPreview.data.js'

// Página temporal para revisar los componentes base (ruta /componentes).
// Para sumar un componente: agregá su <Seccion> y su link en SECCIONES.

const SECCIONES = [
  { id: 'button', titulo: 'Button' },
  { id: 'icon-button', titulo: 'IconButton y RowActions' },
  { id: 'badge', titulo: 'Badge y StatusTag' },
  { id: 'campos', titulo: 'Input, Select y Textarea' },
  { id: 'form-field', titulo: 'FormField' },
]

function Seccion({ id, titulo, descripcion, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className={styles.section}>
      <h2 id={`${id}-titulo`} className={styles.sectionTitle}>
        {titulo}
      </h2>
      {descripcion && <p className={styles.description}>{descripcion}</p>}
      {children}
    </section>
  )
}

function Muestra({ titulo, children }) {
  return (
    <div className={styles.sample}>
      <h3 className={styles.sampleTitle}>{titulo}</h3>
      <div className={styles.row}>{children}</div>
    </div>
  )
}

/** Formulario de ejemplo: al enviar vacío muestra errores y enfoca el primero. */
function FormularioEjemplo() {
  const [valores, setValores] = useState(FORM_INICIAL)
  const [errores, setErrores] = useState({})
  const [valido, setValido] = useState(false)
  const campos = useRef({})

  const registrar = (campo) => (el) => {
    campos.current[campo] = el
  }

  const cambiar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }))
    setValido(false)
  }

  const enviar = (e) => {
    e.preventDefault()
    const nuevos = validarFormulario(valores)
    setErrores(nuevos)
    const primero = ORDEN_CAMPOS.find((campo) => nuevos[campo])
    setValido(!primero)
    if (primero) campos.current[primero]?.focus()
  }

  const limpiar = () => {
    setValores(FORM_INICIAL)
    setErrores({})
    setValido(false)
  }

  return (
    <form noValidate onSubmit={enviar} className={styles.form} aria-labelledby="form-ejemplo-titulo">
      <h3 id="form-ejemplo-titulo" className={styles.sampleTitle}>
        Formulario de ejemplo (con estado real)
      </h3>
      <FormField label="Nombre del cliente" required error={errores.nombre}>
        {(field) => (
          <Input {...field} ref={registrar('nombre')} value={valores.nombre} onChange={cambiar('nombre')} autoComplete="name" />
        )}
      </FormField>
      <FormField label="Correo electrónico" required error={errores.email} hint="Ejemplo: nombre@empresa.com">
        {(field) => (
          <Input {...field} ref={registrar('email')} type="email" value={valores.email} onChange={cambiar('email')} autoComplete="email" />
        )}
      </FormField>
      <FormField label="Línea de aberturas" required error={errores.linea}>
        {(field) => (
          <Select {...field} ref={registrar('linea')} placeholder="Elegí una línea" options={LINEAS} value={valores.linea} onChange={cambiar('linea')} />
        )}
      </FormField>
      <FormField label="Observaciones" hint="Opcional. Medidas, colores o aclaraciones.">
        {(field) => <Textarea {...field} ref={registrar('observaciones')} value={valores.observaciones} onChange={cambiar('observaciones')} />}
      </FormField>
      <div className={styles.row}>
        <Button type="submit" icon={<Save />}>
          Guardar
        </Button>
        <Button variant="outline" onClick={limpiar}>
          Limpiar
        </Button>
      </div>
      <p role="status" className={styles.status}>
        {valido ? 'Formulario válido. Es una demo: no se envía a ningún lado.' : ''}
      </p>
    </form>
  )
}

export default function ComponentsPreview() {
  const [ultimaAccion, setUltimaAccion] = useState('ninguna todavía')
  const accion = (texto) => () => setUltimaAccion(texto)

  // Componentes pendientes (los programa otra persona del equipo).
  // Cuando se apliquen, sumá su <Seccion> al final del <main> y su link en SECCIONES.
  // TODO: agregar <MainLayout> cuando se aplique
  // TODO: agregar <Sidebar> cuando se aplique
  // TODO: agregar <Header> cuando se aplique
  // TODO: agregar <PageHeader> cuando se aplique
  // TODO: agregar <StatCard> cuando se aplique
  // TODO: agregar <DataTable> cuando se aplique
  // TODO: agregar <Pagination> cuando se aplique
  // TODO: agregar <Tabs> cuando se aplique
  // TODO: agregar <SearchBar> cuando se aplique
  // TODO: agregar <FilterBar> cuando se aplique
  // TODO: agregar <ProductCard> cuando se aplique
  // TODO: agregar <ConfirmModal> cuando se aplique

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Componentes base</h1>
        <p className={styles.description}>
          Página temporal para revisar los componentes aplicados. Pasá el mouse para ver el hover y usá Tab para ver el foco.
        </p>
        <nav aria-label="Secciones de la página">
          <ul className={styles.nav}>
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={styles.navLink}>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <Seccion id="button" titulo="Button" descripcion="Botón con texto. Variantes: primary, outline y danger.">
        <Muestra titulo="Variantes">
          {BUTTON_VARIANTS.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </Muestra>
        <Muestra titulo="Con ícono">
          <Button icon={<Plus />}>Nuevo cliente</Button>
          <Button variant="outline" icon={<Download />}>
            Exportar
          </Button>
          <Button variant="danger" icon={<Trash2 />}>
            Eliminar
          </Button>
        </Muestra>
        <Muestra titulo="Deshabilitado">
          {BUTTON_VARIANTS.map((v) => (
            <Button key={v} variant={v} disabled>
              {v}
            </Button>
          ))}
        </Muestra>
      </Seccion>

      <Seccion id="icon-button" titulo="IconButton y RowActions" descripcion="Botones solo de ícono: el label va en aria-label y title.">
        <Muestra titulo="Tonos">
          {ICON_BUTTON_TONES.map((tone) => (
            <IconButton key={tone} tone={tone} label={`Destacar (tono ${tone})`} icon={<Star />} onClick={accion(`Destacar, tono ${tone}`)} />
          ))}
        </Muestra>
        <Muestra titulo="Deshabilitado">
          <IconButton label="Editar (deshabilitado)" icon={<Pencil />} disabled />
        </Muestra>
        <Muestra titulo={`RowActions con las cuatro acciones (itemName="${ITEM_DEMO}")`}>
          <RowActions
            itemName={ITEM_DEMO}
            onView={accion(`Ver ${ITEM_DEMO}`)}
            onEdit={accion(`Editar ${ITEM_DEMO}`)}
            onDelete={accion(`Eliminar ${ITEM_DEMO}`)}
            onBlock={accion(`Bloquear ${ITEM_DEMO}`)}
          />
        </Muestra>
        <Muestra titulo="RowActions solo con editar y eliminar">
          <RowActions itemName={ITEM_DEMO} onEdit={accion(`Editar ${ITEM_DEMO}`)} onDelete={accion(`Eliminar ${ITEM_DEMO}`)} />
        </Muestra>
        <p role="status" className={styles.status}>
          Última acción: {ultimaAccion}
        </p>
      </Seccion>

      <Seccion id="badge" titulo="Badge y StatusTag" descripcion="El significado siempre va en el texto; el color acompaña.">
        <Muestra titulo="Badge: los seis tonos">
          {BADGE_TONES.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </Muestra>
        <Muestra titulo="StatusTag: estados del mapa">
          {STATUSES.map((s) => (
            <StatusTag key={s} status={s} />
          ))}
        </Muestra>
        <Muestra titulo={`StatusTag: estado desconocido ("${UNKNOWN_STATUS}") → tono neutral`}>
          <StatusTag status={UNKNOWN_STATUS} />
        </Muestra>
      </Seccion>

      <Seccion id="campos" titulo="Input, Select y Textarea" descripcion="En estos ejemplos sueltos, aria-label hace de etiqueta. En pantallas reales van dentro de FormField.">
        <div className={styles.grid}>
          <Muestra titulo="Input">
            <div className={styles.stack}>
              <Input aria-label="Input normal" placeholder="Normal" />
              <Input aria-label="Input deshabilitado" placeholder="Deshabilitado" disabled />
              <Input aria-label="Input con error" placeholder="Con error" invalid />
            </div>
          </Muestra>
          <Muestra titulo="Select">
            <div className={styles.stack}>
              <Select aria-label="Select normal" placeholder="Normal" options={LINEAS} />
              <Select aria-label="Select deshabilitado" placeholder="Deshabilitado" options={LINEAS} disabled />
              <Select aria-label="Select con error" placeholder="Con error" options={LINEAS} invalid />
            </div>
          </Muestra>
          <Muestra titulo="Textarea">
            <div className={styles.stack}>
              <Textarea aria-label="Textarea normal" placeholder="Normal" rows={2} />
              <Textarea aria-label="Textarea deshabilitado" placeholder="Deshabilitado" rows={2} disabled />
              <Textarea aria-label="Textarea con error" placeholder="Con error" rows={2} invalid />
            </div>
          </Muestra>
        </div>
      </Seccion>

      <Seccion id="form-field" titulo="FormField" descripcion="Etiqueta, control, ayuda y error conectados por id.">
        <div className={styles.grid}>
          <FormField label="Obligatorio" required>
            {(field) => <Input {...field} placeholder="Tiene asterisco y required" />}
          </FormField>
          <FormField label="Con ayuda" hint="Texto de ayuda debajo del campo.">
            {(field) => <Input {...field} />}
          </FormField>
          <FormField label="Con error" required error="Este campo es obligatorio.">
            {(field) => <Input {...field} />}
          </FormField>
        </div>
        <FormularioEjemplo />
      </Seccion>
    </main>
  )
}
