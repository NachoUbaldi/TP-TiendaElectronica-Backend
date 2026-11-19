import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Tag,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Truck
} from 'lucide-react';
import { getProductById } from '../services/api';
import { SpotlightCard, GradientText } from '../components/reactbits/ReactBits';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
      })
      .catch((err) => setError(err.message || 'No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container container">
        <div className="loading-state">Cargando detalle de la publicación...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container container">
        <SpotlightCard className="empty-state-card">
          <h3>{error || 'Publicación no encontrada'}</h3>
          <Link to="/catalogo" className="btn btn-violet">
            <ArrowLeft size={16} />
            <span>Volver al catálogo</span>
          </Link>
        </SpotlightCard>
      </div>
    );
  }

  const images =
    Array.isArray(product.imagenes) && product.imagenes.length > 0
      ? product.imagenes
      : [FALLBACK_IMG];

  const categoryName =
    typeof product.categoria === 'object' && product.categoria?.name
      ? product.categoria.name
      : 'Tecnología';

  const hasPrice =
    product.precio !== undefined && product.precio !== null && product.precio !== '';

  return (
    <div className="page-container container">
      <div className="breadcrumb-row">
        <Link to="/catalogo" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          <span>Volver al Catálogo</span>
        </Link>
      </div>

      <div className="product-detail-grid">
        {/* GALERÍA DE IMÁGENES */}
        <div className="product-gallery">
          <SpotlightCard className="product-main-image-card">
            <img
              src={images[activeImage] || FALLBACK_IMG}
              alt={product.nombre}
              className="product-detail-img"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
          </SpotlightCard>

          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`thumb-btn ${activeImage === idx ? 'is-active' : ''}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.nombre} vista ${idx + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFORMACIÓN DEL PRODUCTO */}
        <SpotlightCard className="product-info-panel">
          <div className="product-detail-badges">
            <span className="badge badge-category">
              <Tag size={13} />
              {categoryName}
            </span>
            {product.destacado && (
              <span className="badge badge-featured">
                <Sparkles size={13} />
                Publicación Destacada
              </span>
            )}
            {product.disponible ? (
              <span className="status-pill status-available">
                <CheckCircle2 size={14} />
                Disponible en Stock
              </span>
            ) : (
              <span className="status-pill status-unavailable">
                <XCircle size={14} />
                Temporalmente sin disponibilidad
              </span>
            )}
          </div>

          <h1 className="product-detail-title">{product.nombre}</h1>

          <div className="product-detail-price-box">
            <span className="price-label">Precio de lista</span>
            {hasPrice ? (
              <GradientText className="product-detail-price">
                $ {Number(product.precio).toLocaleString('es-AR')}
              </GradientText>
            ) : (
              <span className="product-detail-price">Precio a consultar</span>
            )}
          </div>

          <div className="product-detail-section">
            <h4>Descripción técnica</h4>
            <p className="product-detail-description">{product.descripcion}</p>
          </div>

          <div className="product-perks-grid">
            <div className="perk-item">
              <ShieldCheck size={20} className="violet-icon" />
              <div>
                <strong>Garantía Oficial</strong>
                <span>Soporte directo con el comercio</span>
              </div>
            </div>
            <div className="perk-item">
              <Truck size={20} className="violet-icon" />
              <div>
                <strong>Retiro o Envío</strong>
                <span>Showroom CABA y envíos a todo el país</span>
              </div>
            </div>
          </div>

          <div className="product-detail-actions">
            <Link
              to={`/contacto?asunto=${encodeURIComponent(
                `Consulta por: ${product.nombre}`
              )}`}
              className="btn btn-violet-glow btn-lg"
            >
              <MessageSquare size={18} />
              <span>Consultar por esta publicación</span>
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}

