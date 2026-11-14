import { BrowserRouter, Link, Route, Routes } from 'react-router';
import ComponentsPreview from './pages/ComponentsPreview.jsx';
import TokensPreview from './pages/TokensPreview.jsx';

function Inicio() {
  return (
    <main className="app-placeholder">
      <h1>ALUMAT</h1>
      <p>
        Base de estilos lista. Revisá los tokens en{' '}
        <Link to="/tokens">/tokens</Link> y los componentes en{' '}
        <Link to="/componentes">/componentes</Link>.
      </p>
    </main>
  );
}

function NoEncontrada() {
  return (
    <main className="app-placeholder">
      <h1>Página no encontrada</h1>
      <p>
        La dirección no existe. <Link to="/">Volver al inicio</Link>.
      </p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        {/* Páginas temporales de revisión */}
        <Route path="/tokens" element={<TokensPreview />} />
        <Route path="/componentes" element={<ComponentsPreview />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
