import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, XCircle, Sparkles, Tag } from 'lucide-react';
import { SpotlightCard } from './reactbits/ReactBits';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80';

export default function ProductCard({ product }) {
  const categoryName =
    typeof product.categoria === 'object' && product.categoria?.name
      ? product.categoria.name
      : 'Tecnología';

  const mainImage =
    Array.isArray(product.imagenes) && product.imagenes.length > 0 && product.imagenes[0]
      ? product.imagenes[0]
      : FALLBACK_IMG;

  const hasPrice =
    product.precio !== undefined && product.precio !== null && product.precio !== '';

  return (
    <SpotlightCard tilt className="product-card">
      <div className="product-card-media">
        <img
          src={mainImage}
          alt={product.nombre}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        <div className="product-badges-top">
          <span className="badge badge-category">
            <Tag size={12} />
            {categoryName}
          </span>
          {product.destacado && (
            <span className="badge badge-featured">
              <Sparkles size={12} />
              Destacado
            </span>
          )}
        </div>

        <div className="product-badge-availability">
          {product.disponible ? (
            <span className="status-pill status-available">
              <CheckCircle2 size={13} />
              Disponible
            </span>
          ) : (
            <span className="status-pill status-unavailable">
              <XCircle size={13} />
              No disponible
            </span>
          )}
        </div>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.nombre}</h3>
        <p className="product-card-desc">{product.descripcion}</p>

        <div className="product-card-footer">
          <div className="product-price-block">
            <span className="price-label">Precio contado</span>
            {hasPrice ? (
              <span className="price-value">
                $ {Number(product.precio).toLocaleString('es-AR')}
              </span>
            ) : (
              <span className="price-value price-consult">Consultar</span>
            )}
          </div>

          <Link
            to={`/producto/${product._id}`}
            className="btn btn-violet-glow btn-sm"
          >
            <span>Ver detalle</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </SpotlightCard>
  );
}

