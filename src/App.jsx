import TokensPreview from './pages/TokensPreview.jsx'

// Sin router todavía (la tarea no permite dependencias nuevas): la página
// temporal de tokens se muestra según la ruta.
function App() {
  if (window.location.pathname.replace(/\/$/, '') === '/tokens') {
    return <TokensPreview />
  }

  return (
    <main className="app-placeholder">
      <h1>ALUMAT</h1>
      <p>
        Base de estilos lista. Revisá los tokens en <a href="/tokens">/tokens</a>.
      </p>
    </main>
  )
}

export default App
