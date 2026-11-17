import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DISENOS_MOCK } from "../../mocks/disenosmosck";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatCard from "../../components/StatCard/StatCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";

const ITEMS_POR_PAGINA = 4;

// Colores para los tags de categoría según la consigna
const COLORES_CATEGORIA = {
  Gráficos: "#8b5cf6",
  Logos: "#3b82f6",
  Patrones: "#10b981",
  Ilustraciones: "#f59e0b",
  Badges: "#ec4899",
};

export default function Disenos() {
  const navigate = useNavigate();

  const [disenos, setDisenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modoVista, setModoVista] = useState("tabla"); // "tabla" o "cards"

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);

  // Carga inicial simulada
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDisenos(DISENOS_MOCK);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Resetear a página 1 cuando cambian los filtros o la búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaFiltro, estadoFiltro]);

  // Cálculo de métricas para StatCards
  const stats = useMemo(() => {
    const total = disenos.length;
    const activos = disenos.filter((d) => d.estado === "activo").length;
    const inactivos = disenos.filter((d) => d.estado === "inactivo").length;
    const categoriasUnicas = new Set(disenos.map((d) => d.categoria)).size;
    return { total, activos, inactivos, categorias: categoriasUnicas };
  }, [disenos]);

  // Lista dinámica de categorías para el select
  const categorias = useMemo(() => {
    const unicas = new Set(disenos.map((d) => d.categoria));
    return ["todas", ...Array.from(unicas)];
  }, [disenos]);

  // Filtrado por búsqueda, categoría y estado
  const disenosFiltrados = useMemo(() => {
    return disenos.filter((d) => {
      const texto = busqueda.toLowerCase();
      const coincideBusqueda =
        d.nombre.toLowerCase().includes(texto) ||
        d.descripcion.toLowerCase().includes(texto);
      const coincideCategoria =
        categoriaFiltro === "todas" || d.categoria === categoriaFiltro;
      const coincideEstado =
        estadoFiltro === "todos" || d.estado === estadoFiltro;

      return coincideBusqueda && coincideCategoria && coincideEstado;
    });
  }, [disenos, busqueda, categoriaFiltro, estadoFiltro]);

  // Paginación
  const totalPaginas = Math.max(
    1,
    Math.ceil(disenosFiltrados.length / ITEMS_POR_PAGINA)
  );

  const disenosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return disenosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [disenosFiltrados, paginaActual]);

  // Acciones de ejemplo (Ver / Editar / Eliminar)
  const handleVer = (diseno) => {
    alert(`Viendo detalle de: ${diseno.nombre}\n${diseno.descripcion}`);
  };

  const handleEditar = (diseno) => {
    alert(`Editando diseño #${diseno.id}: ${diseno.nombre}`);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este diseño?")) {
      setDisenos((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header con botón Nuevo Diseño */}
      <PageHeader
        title="Gestión de Diseños"
        subtitle="Administrá el catálogo de diseños disponibles"
        actionLabel="Nuevo diseño"
        onAction={() => navigate("/disenos/nuevo")}
      />

      {/* StatCards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Activos" value={stats.activos} />
        <StatCard title="Inactivos" value={stats.inactivos} />
        <StatCard title="Categorías" value={stats.categorias} />
      </div>

      {/* Barra de búsqueda, filtros y toggle de vista */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", flex: 1 }}>
          <SearchBar
            value={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar diseño por nombre o descripción..."
          />

          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "todas" ? "Todas las categorías" : cat}
              </option>
            ))}
          </select>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>

        {/* Toggle Tabla / Cards */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setModoVista("tabla")}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              cursor: "pointer",
              backgroundColor: modoVista === "tabla" ? "#2563eb" : "#ffffff",
              color: modoVista === "tabla" ? "#ffffff" : "#374151",
              fontWeight: 500,
            }}
          >
            Tabla
          </button>
          <button
            type="button"
            onClick={() => setModoVista("cards")}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              cursor: "pointer",
              backgroundColor: modoVista === "cards" ? "#2563eb" : "#ffffff",
              color: modoVista === "cards" ? "#ffffff" : "#374151",
              fontWeight: 500,
            }}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Contenido Principal: Carga -> Vacío -> Tabla / Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}>
          Cargando diseños...
        </div>
      ) : disenosFiltrados.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            border: "1px dashed #d1d5db",
            borderRadius: "8px",
            color: "#6b7280",
          }}
        >
          <p style={{ marginBottom: "12px" }}>
            No se encontraron diseños que coincidan con los filtros aplicados.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setCategoriaFiltro("todas");
              setEstadoFiltro("todos");
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              cursor: "pointer",
              backgroundColor: "#f9fafb",
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : modoVista === "tabla" ? (
        /* VISTA TABLA */
        <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <tr>
                <th style={{ padding: "12px" }}>#</th>
                <th style={{ padding: "12px" }}>Imagen</th>
                <th style={{ padding: "12px" }}>Nombre</th>
                <th style={{ padding: "12px" }}>Categoría</th>
                <th style={{ padding: "12px" }}>Descripción</th>
                <th style={{ padding: "12px" }}>Estado</th>
                <th style={{ padding: "12px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {disenosPaginados.map((d, index) => (
                <tr key={d.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px" }}>
                    {(paginaActual - 1) * ITEMS_POR_PAGINA + index + 1}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <img
                      src={d.imagen}
                      alt={d.nombre}
                      style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  </td>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{d.nombre}</td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        backgroundColor: COLORES_CATEGORIA[d.categoria] || "#6b7280",
                        color: "#ffffff",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {d.categoria}
                    </span>
                  </td>
                  <td style={{ padding: "12px", maxWidth: "280px", color: "#4b5563", fontSize: "14px" }}>
                    {d.descripcion}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: d.estado === "activo" ? "#dcfce7" : "#f3f4f6",
                        color: d.estado === "activo" ? "#166534" : "#374151",
                      }}
                    >
                      {d.estado === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button type="button" onClick={() => handleVer(d)}>Ver</button>
                      <button type="button" onClick={() => handleEditar(d)}>Editar</button>
                      <button type="button" onClick={() => handleEliminar(d.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* VISTA CARDS */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {disenosPaginados.map((d) => (
            <div
              key={d.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#ffffff",
              }}
            >
              <div>
                <img
                  src={d.imagen}
                  alt={d.nombre}
                  style={{ width: "100%", height: "160px", objectFit: "cover" }}
                />
                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span
                      style={{
                        backgroundColor: COLORES_CATEGORIA[d.categoria] || "#6b7280",
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        fontSize: "12px",
                      }}
                    >
                      {d.categoria}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: d.estado === "activo" ? "#166534" : "#6b7280",
                      }}
                    >
                      {d.estado === "activo" ? "● Activo" : "● Inactivo"}
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{d.nombre}</h3>
                  <p style={{ margin: 0, fontSize: "14px", color: "#4b5563" }}>{d.descripcion}</p>
                </div>
              </div>

              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button type="button" onClick={() => handleVer(d)}>Ver</button>
                <button type="button" onClick={() => handleEditar(d)}>Editar</button>
                <button type="button" onClick={() => handleEliminar(d.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

     {/* Paginación */}
     {!loading && disenosFiltrados.length > 0 && (
        <Pagination
          currentPage={paginaActual}
          totalPages={totalPaginas}
          onPageChange={setPaginaActual}
        />
      )}
    </div>
  );
}