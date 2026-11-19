import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GradientText } from './reactbits/ReactBits';

export default function Footer() {
  const { info } = useStore();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="brand-link" style={{ marginBottom: '0.85rem' }}>
            <div className="brand-icon-box">
              <Cpu size={20} />
            </div>
            <GradientText className="brand-title">
              {info?.nombre || 'Tienda Electrónica & Hardware UADE'}
            </GradientText>
          </div>
          <p className="footer-desc">
            {info?.descripcion ||
              'Especialistas en componentes de alta gama para PC, simracing profesional, domótica inteligente y conectividad.'}
          </p>
          <div className="social-row">
            {info?.redesSociales?.instagram && (
              <a
                href={`https://instagram.com/${info.redesSociales.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="social-pill"
              >
                <Instagram size={15} />
                <span>{info.redesSociales.instagram}</span>
              </a>
            )}
            {info?.redesSociales?.facebook && (
              <a
                href={`https://facebook.com/${info.redesSociales.facebook}`}
                target="_blank"
                rel="noreferrer"
                className="social-pill"
              >
                <Facebook size={15} />
                <span>{info.redesSociales.facebook}</span>
              </a>
            )}
            {info?.redesSociales?.whatsapp && (
              <a
                href={`https://wa.me/${info.redesSociales.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="social-pill"
              >
                <MessageCircle size={15} />
                <span>WhatsApp: {info.redesSociales.whatsapp}</span>
              </a>
            )}
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navegación</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/catalogo">Catálogo de Productos</Link>
            </li>
            <li>
              <Link to="/contacto">Formulario de Contacto</Link>
            </li>
            <li>
              <Link to="/login">Portal Administrador</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Información Institucional</h4>
          <ul className="footer-contact-list">
            {info?.direccion && (
              <li>
                <MapPin size={16} className="violet-icon" />
                <span>{info.direccion}</span>
              </li>
            )}
            {info?.telefono && (
              <li>
                <Phone size={16} className="violet-icon" />
                <span>{info.telefono}</span>
              </li>
            )}
            {info?.email && (
              <li>
                <Mail size={16} className="violet-icon" />
                <span>{info.email}</span>
              </li>
            )}
            {info?.horarios && (
              <li>
                <Clock size={16} className="violet-icon" />
                <span>{info.horarios}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {info?.nombre || 'Tienda Electrónica'}. Todos los derechos reservados.
        </span>
        <span className="footer-tech-tag">
          React + Node/Express + MongoDB • UI powered by ReactBits patterns
        </span>
      </div>
    </footer>
  );
}

