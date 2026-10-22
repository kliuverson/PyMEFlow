
import { useState } from "react";
import "./App.css";

const navigation = [
  { name: "Dashboard", icon: "▦" },
  { name: "Ventas", icon: "↗" },
  { name: "Inventario", icon: "▣" },
  { name: "Clientes", icon: "♙" },
  { name: "Productos", icon: "◇" },
  { name: "Facturación", icon: "▤" },
  { name: "Reportes", icon: "▥" },
  { name: "Configuración", icon: "⚙" },
];

const stats = [
  {
    title: "Ventas del mes",
    value: "$ 8.450.000",
    change: "+12,5%",
    icon: "↗",
  },
  {
    title: "Ingresos",
    value: "$ 7.280.000",
    change: "+8,3%",
    icon: "$",
  },
  {
    title: "Clientes",
    value: "124",
    change: "+9,1%",
    icon: "♙",
  },
  {
    title: "Productos",
    value: "48",
    change: "+4,3%",
    icon: "◇",
  },
];

const sales = [
  { day: "Lun", height: 42 },
  { day: "Mar", height: 62 },
  { day: "Mié", height: 50 },
  { day: "Jue", height: 76 },
  { day: "Vie", height: 59 },
  { day: "Sáb", height: 92 },
  { day: "Dom", height: 68 },
];

const distribution = [
  { name: "Productos", percentage: 45 },
  { name: "Servicios", percentage: 25 },
  { name: "Accesorios", percentage: 18 },
  { name: "Otros", percentage: 12 },
];

const recentSales = [
  { id: "V-001", customer: "Juan Pérez", product: "Audífonos Bluetooth", total: "$ 450.000", status: "Completada" },
  { id: "V-002", customer: "María Gómez", product: "Reloj deportivo", total: "$ 320.000", status: "Completada" },
  { id: "V-003", customer: "Carlos López", product: "Mochila casual", total: "$ 280.000", status: "Pendiente" },
  { id: "V-004", customer: "Ana Torres", product: "Mouse inalámbrico", total: "$ 150.000", status: "Completada" },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");

  const filteredSales = recentSales.filter((sale) =>
    `${sale.id} ${sale.customer} ${sale.product}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <h1 className="brand-name">
              PyME<span>Flow</span>
            </h1>
            <p className="brand-caption">Tu negocio, en un solo lugar</p>
          </div>
        </div>

        <nav aria-label="Navegación principal">
          <p className="nav-label">Menú principal</p>
          <div className="nav-list">
            {navigation.map((item) => (
              <button
                key={item.name}
                type="button"
                className={`nav-item ${activePage === item.name ? "active" : ""}`}
                onClick={() => setActivePage(item.name)}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <strong>PyMEFlow</strong>
          <br />
          Gestiona. Crece. Simplifica.
          <br />
          <span>Versión 1.0.0</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <input
            className="search"
            type="search"
            placeholder="Buscar una venta, cliente o producto..."
            aria-label="Buscar ventas"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="profile">
            <div className="profile-avatar">A</div>
            <div>
              <strong>Administrador</strong>
              <span className="profile-role">Mi empresa</span>
            </div>
          </div>
        </header>

        <div className="content">
          <section className="page-heading">
            <div>
              <h1>{activePage === "Dashboard" ? "¡Bienvenido a PyMEFlow!" : activePage}</h1>
              <p>
                {activePage === "Dashboard"
                  ? "Aquí tienes un resumen de la actividad de tu negocio."
                  : `Este es el espacio de ${activePage.toLowerCase()}. Próximamente podrás gestionar este módulo.`}
              </p>
            </div>
            <span className="date-label">Panel de gestión · Colombia</span>
          </section>

          {activePage === "Dashboard" ? (
            <>
              <section className="stats-grid" aria-label="Indicadores del negocio">
                {stats.map((stat) => (
                  <article className="stat-card" key={stat.title}>
                    <div className="stat-top">
                      <span>{stat.title}</span>
                      <span className="stat-icon" aria-hidden="true">
                        {stat.icon}
                      </span>
                    </div>
                    <p className="stat-value">{stat.value}</p>
                    <span className="stat-change">
                      ↑ {stat.change}
                      <span className="stat-note">vs. mes anterior</span>
                    </span>
                  </article>
                ))}
              </section>

              <section className="panels-grid">
                <article className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Resumen de ventas</h2>
                      <p className="panel-subtitle">Actividad de los últimos 7 días</p>
                    </div>
                    <span className="panel-action">Esta semana</span>
                  </div>

                  <div
                    className="chart-placeholder"
                    role="img"
                    aria-label="Gráfico ilustrativo de ventas de lunes a domingo"
                  >
                    <div className="chart-bars">
                      {sales.map((item) => (
                        <div className="chart-column" key={item.day}>
                          <div
                            className="chart-bar"
                            style={{ height: `${item.height}%` }}
                          />
                          <span className="chart-day">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Distribución comercial</h2>
                      <p className="panel-subtitle">Por tipo de venta</p>
                    </div>
                  </div>

                  <div className="distribution">
                    {distribution.map((item) => (
                      <div className="distribution-row" key={item.name}>
                        <span>{item.name}</span>
                        <strong>{item.percentage}%</strong>
                        <div className="distribution-track">
                          <div
                            className="distribution-fill"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <section className="panel bottom-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Ventas recientes</h2>
                    <p className="panel-subtitle">
                      Movimientos de ejemplo para visualizar el dashboard
                    </p>
                  </div>
                  <button
                    type="button"
                    className="panel-action"
                    onClick={() => setActivePage("Ventas")}
                  >
                    Ver ventas →
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Referencia</th>
                        <th>Cliente</th>
                        <th>Producto</th>
                        <th>Total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.id}</td>
                          <td>{sale.customer}</td>
                          <td>{sale.product}</td>
                          <td>{sale.total}</td>
                          <td>
                            <span className="status">{sale.status}</span>
                          </td>
                        </tr>
                      ))}
                      {filteredSales.length === 0 && (
                        <tr>
                          <td colSpan={5}>No se encontraron ventas.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : (
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Módulo de {activePage}</h2>
                  <p className="panel-subtitle">
                    Estamos preparando las funciones de este apartado.
                  </p>
                </div>
              </div>
              <p>
                La navegación ya funciona. Los datos y operaciones reales se
                incorporarán cuando implementemos este módulo.
              </p>
              <button
                type="button"
                className="nav-item active"
                onClick={() => setActivePage("Dashboard")}
              >
                ← Volver al dashboard
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
