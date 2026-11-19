import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  PackageSearch,
  Tag
} from 'lucide-react';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import { BlurText, GradientText, SpotlightCard } from '../components/reactbits/ReactBits';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '');
  const [disponible, setDisponible] = useState(searchParams.get('disponible') || '');
  const [minPrecio, setMinPrecio] = useState(searchParams.get('minPrecio') || '');
  const [maxPrecio, setMaxPrecio] = useState(searchParams.get('maxPrecio') || '');

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError('');

    if (
      minPrecio !== '' &&
      maxPrecio !== '' &&
      Number(minPrecio) > Number(maxPrecio)
    ) {
      setError('El precio mínimo no puede ser mayor al precio máximo.');
      setLoading(false);
      return;
    }

    try {
      const data = await getProducts({
        search: search.trim() || undefined,
        categoria: categoria || undefined,
        disponible: disponible !== '' ? disponible : undefined,
        minPrecio: minPrecio !== '' ? minPrecio : undefined,
        maxPrecio: maxPrecio !== '' ? maxPrecio : undefined
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las publicaciones.');
    } finally {
      setLoading(false);
    }
  }, [search, categoria, disponible, minPrecio, maxPrecio]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleCategorySelect = (catId) => {
    setCategoria(catId);
    const next = new URLSearchParams(searchParams);
    if (catId) next.set('categoria', catId);
    else next.delete('categoria');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategoria('');
    setDisponible('');
    setMinPrecio('');
    setMaxPrecio('');
    setSearchParams({});
  };

  return (
    <div className="page-container container">
      <div className="catalog-header">
        <BlurText
          text="Catálogo de Productos y Servicios"
          animateBy="words"
          className="page-title"
        />
        <p className="page-subtitle">
          Explorá nuestras publicaciones, buscá por palabra clave o filtrá por{' '}
          <GradientText>categoría, disponibilidad y rango de precio</GradientText>.
        </p>
      </div>

      {/* PILLS DE CATEGORÍAS */}
      <div className="category-pills-bar">
        <button
          type="button"
          className={`cat-filter-pill ${categoria === '' ? 'is-active' : ''}`}
          onClick={() => handleCategorySelect('')}
        >
          <Tag size={14} />
          <span>Todas ({categories.length})</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            className={`cat-filter-pill ${
              categoria === cat._id || categoria === cat.name ? 'is-active' : ''
            }`}
            onClick={() => handleCategorySelect(cat._id)}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* PANEL DE BÚSQUEDA Y FILTROS */}
      <SpotlightCard className="filters-panel">
        <div className="filters-grid">
          <div className="form-group">
            <label>Buscar publicación</label>
            <div className="input-with-icon">
              <Search size={17} />
              <input
                type="text"
                placeholder="Nombre o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              value={categoria}
              onChange={(e) => handleCategorySelect(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Disponibilidad</label>
            <select
              value={disponible}
              onChange={(e) => setDisponible(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="true">Solo disponibles</option>
              <option value="false">No disponibles</option>
            </select>
          </div>

          <div className="form-group">
            <label>Precio Mínimo ($)</label>
            <input
              type="number"
              min="0"
              placeholder="Ej: 15000"
              value={minPrecio}
              onChange={(e) => setMinPrecio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Precio Máximo ($)</label>
            <input
              type="number"
              min="0"
              placeholder="Ej: 1500000"
              value={maxPrecio}
              onChange={(e) => setMaxPrecio(e.target.value)}
            />
          </div>

          <div className="form-group filters-actions">
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-outline-violet"
              title="Limpiar filtros"
            >
              <RotateCcw size={16} />
              <span>Limpiar</span>
            </button>
          </div>
        </div>
      </SpotlightCard>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="catalog-results-meta">
        <span>
          Mostrando <strong>{products.length}</strong>{' '}
          {products.length === 1 ? 'publicación' : 'publicaciones'}
        </span>
      </div>

      {loading ? (
        <div className="loading-state">Buscando publicaciones...</div>
      ) : products.length === 0 ? (
        <SpotlightCard className="empty-state-card">
          <PackageSearch size={44} className="violet-icon" />
          <h3>No se encontraron publicaciones</h3>
          <p>
            Probá ajustando los filtros de categoría, disponibilidad o rango de
            precio.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="btn btn-violet"
          >
            Ver todo el catálogo
          </button>
        </SpotlightCard>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

