import React, { useState, useEffect, useMemo } from "react";
import { PRODUCTOS_MOCK, DISENOS_REGISTRADOS_MOCK_COUNT } from "./productosMock";

const ITEMS_POR_PAGINA = 6;

export default function ProductosDisenos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("productos");

  // Filtros y búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProductos(PRODUCTOS_MOCK);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Métricas para las StatCards
  const stats = useMemo(() => {
    const total = productos.length;
    const activos = productos.filter((p) => p.estado === "activo").length;
    const inactivos = productos.filter((p) => p.estado === "inactivo").length;
    return {
      total,
      activos,
      inactivos,
      disenos: DISENOS_REGISTRADOS_MOCK_COUNT,
    };
  }, [productos]);

  const categorias = useMemo(() => {
    const unicas = new Set(productos.map((p) => p.categoria));
    return ["todas", ...Array.from(unicas)];
  }, [productos]);

  // Filtrado de elementos
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoriaFiltro === "todas" || prod.categoria === categoriaFiltro;
      const coincideEstado = estadoFiltro === "todos" || prod.estado === estadoFiltro;
      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  }, [productos, busqueda, categoriaFiltro, estadoFiltro]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaFiltro, estadoFiltro]);

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [productosFiltrados, paginaActual]);

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      setProductos((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* PageHeader */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Productos y Diseños</h1>
          <p style={{ margin: "4px 0 0", color: "#666" }}>Vista general de productos del sistema</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={outlineBtnStyle}>+ Nuevo diseño</button>
          <button style={primaryBtnStyle}>+ Nuevo producto</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "24px", gap: "24px" }}>
        <button onClick={() => setActiveTab("productos")} style={tabStyle(activeTab === "productos")}>
          Productos
        </button>
        <button onClick={() => setActiveTab("disenos")} style={tabStyle(activeTab === "disenos")}>
          Diseños
        </button>
      </div>

      {activeTab === "productos" ? (
        <>
          {/* StatCards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <StatCard title="Total productos" value={stats.total} />
            <StatCard title="Activos" value={stats.activos} color="#16a34a" />
            <StatCard title="Inactivos" value={stats.inactivos} color="#dc2626" />
            <StatCard title="Diseños registrados" value={stats.disenos} color="#2563eb" />
          </div>

          {/* SearchBar y Filtros */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
            <input
              type="text"
              placeholder="Buscar producto por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={inputStyle}
            />
            <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} style={inputStyle}>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "todas" ? "Todas las categorías" : cat}
                </option>
              ))}
            </select>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} style={inputStyle}>
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {/* Grilla o Estados */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}>Cargando datos...</div>
          ) : productosPaginados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", border: "1px dashed #d1d5db", borderRadius: "8px", color: "#6b7280" }}>
              <p style={{ fontWeight: "600" }}>No se encontraron productos</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                {productosPaginados.map((producto) => (
                  <div key={producto.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden", background: "#fff", display: "flex", flexDirection: "column" }}>
                    <div style={{ position: "relative" }}>
                      <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                      <span style={{
                        position: "absolute", top: "12px", right: "12px", padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "600",
                        backgroundColor: producto.estado === "activo" ? "#dcfce7" : "#fee2e2",
                        color: producto.estado === "activo" ? "#166534" : "#991b1b"
                      }}>
                        {producto.estado}
                      </span>
                    </div>

                    <div style={{ padding: "16px", flex: 1 }}>
                      <span style={{ fontSize: "12px", color: "#6b7280", textTransform: "uppercase" }}>{producto.categoria}</span>
                      <h3 style={{ margin: "4px 0 12px", fontSize: "18px" }}>{producto.nombre}</h3>
                      <div style={{ fontSize: "14px", color: "#4b5563", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span><strong>Tamaño:</strong> {producto.tamano}</span>
                        <span><strong>Espesor:</strong> {producto.espesor}</span>
                        <span style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginTop: "8px" }}>
                          ${producto.precio.toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
                      <button onClick={() => console.log("Ver", producto.id)} style={actionBtnStyle}>Ver</button>
                      <button onClick={() => console.log("Editar", producto.id)} style={{ ...actionBtnStyle, borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>Editar</button>
                      <button onClick={() => handleEliminar(producto.id)} style={{ ...actionBtnStyle, color: "#dc2626" }}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
                  <button disabled={paginaActual === 1} onClick={() => setPaginaActual((p) => p - 1)} style={pageBtnStyle(paginaActual === 1)}>Anterior</button>
                  <span style={{ fontSize: "14px", color: "#4b5563" }}>Página {paginaActual} de {totalPaginas}</span>
                  <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual((p) => p + 1)} style={pageBtnStyle(paginaActual === totalPaginas)}>Siguiente</button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div style={{ padding: "48px", textAlign: "center", color: "#6b7280" }}>Vista de Diseños en desarrollo.</div>
      )}
    </div>
  );
}

function StatCard({ title, value, color = "#111827" }) {
  return (
    <div style={{ padding: "16px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#fff" }}>
      <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>{title}</div>
      <div style={{ fontSize: "28px", fontWeight: "700", color }}>{value}</div>
    </div>
  );
}

const primaryBtnStyle = { padding: "10px 16px", borderRadius: "6px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer", fontWeight: "600" };
const outlineBtnStyle = { padding: "10px 16px", borderRadius: "6px", border: "1px solid #2563eb", background: "transparent", color: "#2563eb", cursor: "pointer", fontWeight: "600" };
const tabStyle = (activo) => ({ padding: "12px 4px", border: "none", background: "none", cursor: "pointer", fontWeight: activo ? "700" : "400", borderBottom: activo ? "2px solid #2563eb" : "none", color: activo ? "#2563eb" : "#4b5563" });
const inputStyle = { flex: "1 1 200px", padding: "10px 12px", borderRadius: "6px", border: "1px solid #d1d5db" };
const actionBtnStyle = { flex: 1, padding: "10px", border: "none", background: "transparent", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#374151" };
const pageBtnStyle = (disabled) => ({ padding: "8px 14px", borderRadius: "6px", border: "1px solid #d1d5db", background: disabled ? "#f3f4f6" : "#fff", color: disabled ? "#9ca3af" : "#374151", cursor: disabled ? "not-allowed" : "pointer" });