import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Cpu,
  Gauge,
  Wifi,
  Home as HomeIcon,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers
} from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import {
  AuroraBackground,
  BlurText,
  ShinyText,
  GradientText,
  DecryptedText,
  CountUp,
  SpotlightCard,
  Magnet
} from '../components/reactbits/ReactBits';

const CATEGORY_ICONS = [Cpu, HomeIcon, Gauge, Wifi];

export default function HomePage() {
  const { info } = useStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([prodData, catData]) => {
        setProducts(Array.isArray(prodData) ? prodData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/catalogo');
    }
  };

  const featuredProducts = products.filter((p) => p.destacado).length
    ? products.filter((p) => p.destacado).slice(0, 6)
    : products.slice(0, 6);

  return (
    <div className="home-page">
      {/* HERO SECTION WITH REACTBITS AURORA + BLURTEXT + SHINYTEXT */}
      <AuroraBackground className="hero-section">
        <div className="container hero-container">
          <div className="hero-badge-row">
            <GradientText showBorder className="hero-pill">
              <Sparkles size={14} style={{ marginRight: 6 }} />
              <ShinyText
                text={info?.nombre || 'TIENDA ELECTRÓNICA & HARDWARE UADE'}
                speed={3}
              />
            </GradientText>
          </div>

          <BlurText
            text="Tecnología extrema en Violeta, Blanco y Negro."
            animateBy="words"
            delay={75}
            className="hero-title"
          />

          <p className="hero-subtitle">
            {info?.descripcion ||
              'Especialistas en componentes de alta gama para PC, simracing profesional, domótica inteligente y soluciones de conectividad de red.'}
          </p>

          <form onSubmit={handleHeroSearch} className="hero-search-bar">
            <Search size={20} className="hero-search-icon" />
            <input
              type="text"
              placeholder="Buscar RTX 4070, Ryzen 7, Moza R9, ESP32, Router Wi-Fi 6..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-violet">
              <span>Explorar</span>
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="hero-cta-row">
            <Magnet>
              <Link to="/catalogo" className="btn btn-violet-glow btn-lg">
                <span>Ver Catálogo Completo</span>
                <ArrowRight size={18} />
              </Link>
            </Magnet>
            <Magnet>
              <Link to="/contacto" className="btn btn-outline-white btn-lg">
                <span>Enviar Consulta</span>
              </Link>
            </Magnet>
          </div>

          {/* STATS COUNTER BAR */}
          <div className="hero-stats-grid">
            <SpotlightCard className="stat-card">
              <span className="stat-number">
                <CountUp to={products.length || 23} suffix="+" />
              </span>
              <span className="stat-label">
                <DecryptedText text="PRODUCTOS EN CATÁLOGO" />
              </span>
            </SpotlightCard>

            <SpotlightCard className="stat-card">
              <span className="stat-number">
                <CountUp to={categories.length || 4} />
              </span>
              <span className="stat-label">
                <DecryptedText text="CATEGORÍAS TÉCNICAS" />
              </span>
            </SpotlightCard>

            <SpotlightCard className="stat-card">
              <span className="stat-number">
                <CountUp to={100} suffix="%" />
              </span>
              <span className="stat-label">
                <DecryptedText text="GARANTÍA OFICIAL" />
              </span>
            </SpotlightCard>

            <SpotlightCard className="stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label">
                <DecryptedText text="SOPORTE & CONSULTAS" />
              </span>
            </SpotlightCard>
          </div>
        </div>
      </AuroraBackground>

      {/* CATEGORÍAS SECTION */}
      <section className="section container">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              <Layers size={14} />
              <span>ECOSISTEMA TECNOLÓGICO</span>
            </span>
            <h2 className="section-title">
              Explorá por <GradientText>Categoría</GradientText>
            </h2>
          </div>
          <Link to="/catalogo" className="btn btn-ghost">
            <span>Ver todas las categorías</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="categories-grid">
          {categories.map((cat, idx) => {
            const IconComp = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
            const count = products.filter(
              (p) =>
                p.categoria?._id === cat._id ||
                p.categoria === cat._id ||
                p.categoria?.name === cat.name
            ).length;

            return (
              <SpotlightCard
                key={cat._id}
                tilt
                className="category-card"
                onClick={() =>
                  navigate(`/catalogo?categoria=${encodeURIComponent(cat._id)}`)
                }
              >
                <div className="category-card-top">
                  <div className="category-icon-ring">
                    <IconComp size={24} />
                  </div>
                  <span className="category-count-pill">
                    {count} {count === 1 ? 'producto' : 'productos'}
                  </span>
                </div>
                <h3 className="category-card-title">{cat.name}</h3>
                <p className="category-card-desc">
                  {cat.description || 'Equipamiento seleccionado de alto rendimiento.'}
                </p>
                <span className="category-card-link">
                  <span>Filtrar publicaciones</span>
                  <ArrowRight size={15} />
                </span>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS SECTION */}
      <section className="section container">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              <Zap size={14} />
              <span>SELECCIÓN HIGH-END</span>
            </span>
            <h2 className="section-title">
              Publicaciones <GradientText>Destacadas</GradientText>
            </h2>
          </div>
          <Link to="/catalogo" className="btn btn-outline-violet">
            <span>Explorar los {products.length || 23} productos</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-state">Cargando catálogo tecnológico...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* INFORMACIÓN INSTITUCIONAL BANNER */}
      <section className="section container">
        <SpotlightCard className="institutional-banner">
          <div className="institutional-grid">
            <div className="institutional-info">
              <span className="section-eyebrow">
                <ShieldCheck size={14} />
                <span>INFORMACIÓN INSTITUCIONAL</span>
              </span>
              <h2 className="institutional-title">
                {info?.nombre || 'Tienda Electrónica & Hardware UADE'}
              </h2>
              <p className="institutional-desc">{info?.descripcion}</p>

              <div className="institutional-details">
                {info?.direccion && (
                  <div className="inst-detail-item">
                    <MapPin size={18} className="violet-icon" />
                    <div>
                      <strong>Dirección</strong>
                      <span>{info.direccion}</span>
                    </div>
                  </div>
                )}
                {info?.telefono && (
                  <div className="inst-detail-item">
                    <Phone size={18} className="violet-icon" />
                    <div>
                      <strong>Teléfono de atención</strong>
                      <span>{info.telefono}</span>
                    </div>
                  </div>
                )}
                {info?.horarios && (
                  <div className="inst-detail-item">
                    <Clock size={18} className="violet-icon" />
                    <div>
                      <strong>Horarios de atención</strong>
                      <span>{info.horarios}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="institutional-cta-box">
              <h3>¿Necesitás asesoramiento técnico?</h3>
              <p>
                Consultanos por compatibilidad de componentes, presupuestos a medida o
                disponibilidad inmediata en showroom.
              </p>
              <Link to="/contacto" className="btn btn-violet-glow btn-lg">
                <span>Ir al Formulario de Contacto</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}

