import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  Store,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { getProducts, getCategories, getConsultas } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  BlurText,
  GradientText,
  CountUp,
  SpotlightCard
} from '../../components/reactbits/ReactBits';

export function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="admin-shell container">
      <aside className="admin-sidebar">
        <SpotlightCard className="admin-sidebar-card">
          <div className="admin-user-chip">
            <div className="admin-avatar">
              {(user?.name?.[0] || 'A').toUpperCase()}
            </div>
            <div>
              <strong>
                {user?.name} {user?.apellido}
              </strong>
              <span>Rol: Administrador</span>
            </div>
          </div>

          <nav className="admin-nav">
            <NavLink to="/admin" end className="admin-nav-link">
              <LayoutDashboard size={17} />
              <span>Dashboard & Métricas</span>
            </NavLink>
            <NavLink to="/admin/productos" className="admin-nav-link">
              <Package size={17} />
              <span>Productos y Servicios</span>
            </NavLink>
            <NavLink to="/admin/categorias" className="admin-nav-link">
              <Layers size={17} />
              <span>Categorías</span>
            </NavLink>
            <NavLink to="/admin/consultas" className="admin-nav-link">
              <MessageSquare size={17} />
              <span>Gestión de Consultas</span>
            </NavLink>
            <NavLink to="/admin/comercio" className="admin-nav-link">
              <Store size={17} />
              <span>Info Institucional</span>
            </NavLink>
            <NavLink to="/admin/perfil" className="admin-nav-link">
              <UserCheck size={17} />
              <span>Mi Perfil</span>
            </NavLink>
          </nav>
        </SpotlightCard>
      </aside>

      <section className="admin-main">
        <Outlet />
      </section>
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    pausedProducts: 0,
    featuredProducts: 0,
    totalCategories: 0,
    totalConsultas: 0,
    pendientes: 0,
    leidas: 0,
    respondidas: 0
  });
  const [recentConsultas, setRecentConsultas] = useState([]);

  useEffect(() => {
    Promise.all([getProducts(), getCategories(), getConsultas()])
      .then(([prods, cats, cons]) => {
        const pList = Array.isArray(prods) ? prods : [];
        const cList = Array.isArray(cats) ? cats : [];
        const qList = Array.isArray(cons) ? cons : [];

        setStats({
          totalProducts: pList.length,
          activeProducts: pList.filter((p) => p.disponible).length,
          pausedProducts: pList.filter((p) => !p.disponible).length,
          featuredProducts: pList.filter((p) => p.destacado).length,
          totalCategories: cList.length,
          totalConsultas: qList.length,
          pendientes: qList.filter((q) => q.estado === 'pendiente').length,
          leidas: qList.filter((q) => q.estado === 'leida').length,
          respondidas: qList.filter((q) => q.estado === 'respondida').length
        });
        setRecentConsultas(qList.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <BlurText
            text="Dashboard de Administración"
            animateBy="words"
            className="admin-module-title"
            as="h1"
          />
          <p className="admin-module-subtitle">
            Métricas en tiempo real del catálogo, categorías y bandeja de consultas.
          </p>
        </div>
        <Link to="/admin/productos" className="btn btn-violet-glow">
          <Package size={16} />
          <span>Gestionar Publicaciones</span>
        </Link>
      </div>

      <div className="dashboard-metrics-grid">
        <SpotlightCard className="metric-card">
          <div className="metric-top">
            <span>Publicaciones Totales</span>
            <Package size={18} className="violet-icon" />
          </div>
          <div className="metric-value">
            <CountUp to={stats.totalProducts} />
          </div>
          <div className="metric-foot">
            <span className="text-success">{stats.activeProducts} activas</span> •{' '}
            <span className="text-muted">{stats.pausedProducts} pausadas</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="metric-card">
          <div className="metric-top">
            <span>Categorías Activas</span>
            <Layers size={18} className="violet-icon" />
          </div>
          <div className="metric-value">
            <CountUp to={stats.totalCategories} />
          </div>
          <div className="metric-foot">
            <Link to="/admin/categorias" className="violet-link">
              Administrar categorías →
            </Link>
          </div>
        </SpotlightCard>

        <SpotlightCard className="metric-card">
          <div className="metric-top">
            <span>Consultas Pendientes</span>
            <Clock size={18} className="violet-icon" />
          </div>
          <div className="metric-value">
            <CountUp to={stats.pendientes} />
          </div>
          <div className="metric-foot">
            <span>
              {stats.leidas} leídas • {stats.respondidas} respondidas
            </span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="metric-card">
          <div className="metric-top">
            <span>Destacados en Portada</span>
            <Sparkles size={18} className="violet-icon" />
          </div>
          <div className="metric-value">
            <CountUp to={stats.featuredProducts} />
          </div>
          <div className="metric-foot">
            <span>Publicaciones con prioridad visual</span>
          </div>
        </SpotlightCard>
      </div>

      <SpotlightCard className="admin-card" style={{ marginTop: '1.5rem' }}>
        <div className="admin-card-header">
          <h3>Últimas Consultas Recibidas</h3>
          <Link to="/admin/consultas" className="btn btn-outline-violet btn-sm">
            <span>Ver Bandeja Completa</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {recentConsultas.length === 0 ? (
          <p className="text-muted">No hay consultas registradas todavía.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Remitente</th>
                  <th>Asunto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentConsultas.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <strong>{c.nombre}</strong>
                      <div className="table-sub">{c.email}</div>
                    </td>
                    <td>{c.asunto}</td>
                    <td>
                      <span className={`consulta-badge estado-${c.estado}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="table-sub">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString('es-AR')
                        : 'Reciente'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
}

