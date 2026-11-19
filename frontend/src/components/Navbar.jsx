import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Cpu,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  User,
  LayoutDashboard,
  Sparkles,
  Wifi
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { getIsOfflineMode, onConnectionModeChange } from '../services/api';
import { GradientText, ShinyText } from './reactbits/ReactBits';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { info } = useStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [offlineMode, setOfflineMode] = useState(getIsOfflineMode());

  useEffect(() => {
    return onConnectionModeChange((val) => setOfflineMode(val));
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-inner">
        <Link to="/" className="brand-link" onClick={closeMenu}>
          <div className="brand-icon-box">
            <Cpu size={22} />
          </div>
          <div className="brand-text">
            <GradientText className="brand-title">
              {info?.nombre || 'VORTEX TECH'}
            </GradientText>
            <span className="brand-sub">
              <ShinyText text="HARDWARE • SIMRACING • DOMÓTICA" speed={4} />
            </span>
          </div>
        </Link>

        <nav className={`nav-links ${mobileOpen ? 'is-open' : ''}`}>
          <NavLink to="/" end className="nav-item" onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className="nav-item" onClick={closeMenu}>
            Catálogo
          </NavLink>
          <NavLink to="/contacto" className="nav-item" onClick={closeMenu}>
            Institucional & Contacto
          </NavLink>

          {isAuthenticated && isAdmin && (
            <NavLink to="/admin" className="nav-item nav-item-admin" onClick={closeMenu}>
              <LayoutDashboard size={16} />
              <span>Panel Admin</span>
            </NavLink>
          )}

          <div className="nav-actions">
            <span
              className={`api-status-pill ${offlineMode ? 'is-offline' : 'is-online'}`}
              title={
                offlineMode
                  ? 'Backend en puerto 4000 no detectado: usando datos locales precargados'
                  : 'Conectado a la API REST en http://localhost:4000/api'
              }
            >
              <Wifi size={12} />
              {offlineMode ? 'Preview Local' : 'API Online'}
            </span>

            {isAuthenticated ? (
              <div className="auth-pill-group">
                <Link
                  to="/admin/perfil"
                  className="btn btn-ghost btn-sm"
                  onClick={closeMenu}
                  title="Modificar datos personales"
                >
                  <User size={15} />
                  <span>{user?.name || 'Admin'}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline-violet btn-sm"
                  title="Cerrar sesión"
                >
                  <LogOut size={15} />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-violet btn-sm"
                onClick={closeMenu}
              >
                <ShieldCheck size={16} />
                <span>Acceso Admin</span>
              </Link>
            )}
          </div>
        </nav>

        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

