import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Power,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Save
} from 'lucide-react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductDisponible,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getConsultas,
  updateEstadoConsulta,
  deleteConsulta
} from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { BlurText, SpotlightCard } from '../../components/reactbits/ReactBits';

// ==================== 1. ADMINISTRACIÓN DE PRODUCTOS ====================

const EMPTY_PRODUCT = {
  nombre: '',
  categoria: '',
  descripcion: '',
  imagenes: [''],
  precio: '',
  disponible: true,
  destacado: false
};

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(Array.isArray(pData) ? pData : []);
      setCategories(Array.isArray(cData) ? cData : []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_PRODUCT,
      categoria: categories[0]?._id || '',
      imagenes: ['']
    });
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (prod) => {
    setEditingId(prod._id);
    setForm({
      nombre: prod.nombre || '',
      categoria:
        typeof prod.categoria === 'object' ? prod.categoria?._id : prod.categoria || '',
      descripcion: prod.descripcion || '',
      imagenes:
        Array.isArray(prod.imagenes) && prod.imagenes.length > 0
          ? [...prod.imagenes]
          : [''],
      precio: prod.precio !== undefined && prod.precio !== null ? String(prod.precio) : '',
      disponible: Boolean(prod.disponible),
      destacado: Boolean(prod.destacado)
    });
    setErrors({});
    setShowForm(true);
  };

  const validateProduct = () => {
    const next = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 2) {
      next.nombre = 'El nombre es obligatorio (mínimo 2 caracteres).';
    }
    if (!form.categoria) {
      next.categoria = 'Seleccioná una categoría obligatoria.';
    }
    if (!form.descripcion.trim() || form.descripcion.trim().length < 5) {
      next.descripcion = 'La descripción es obligatoria (mínimo 5 caracteres).';
    }
    if (form.precio !== '' && (isNaN(Number(form.precio)) || Number(form.precio) < 0)) {
      next.precio = 'El precio no puede ser negativo.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleImageChange = (idx, val) => {
    const nextImgs = [...form.imagenes];
    nextImgs[idx] = val;
    setForm((prev) => ({ ...prev, imagenes: nextImgs }));
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ''] }));
  };

  const removeImageField = (idx) => {
    setForm((prev) => {
      const filtered = prev.imagenes.filter((_, i) => i !== idx);
      return { ...prev, imagenes: filtered.length ? filtered : [''] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    if (!validateProduct()) return;

    const cleanImages = form.imagenes.map((u) => u.trim()).filter(Boolean);
    const payload = {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      descripcion: form.descripcion.trim(),
      imagenes: cleanImages,
      precio: form.precio !== '' ? Number(form.precio) : undefined,
      disponible: Boolean(form.disponible),
      destacado: Boolean(form.destacado)
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setFeedback({ type: 'success', text: 'Publicación actualizada con éxito.' });
      } else {
        await createProduct(payload);
        setFeedback({ type: 'success', text: 'Publicación creada con éxito.' });
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDisponible = async (prod) => {
    try {
      await toggleProductDisponible(prod._id, !prod.disponible);
      setFeedback({
        type: 'success',
        text: `Publicación "${prod.nombre}" ${
          !prod.disponible ? 'activada' : 'desactivada'
        }.`
      });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (prod) => {
    if (!window.confirm(`¿Eliminar definitivamente "${prod.nombre}"?`)) return;
    try {
      await deleteProduct(prod._id);
      setFeedback({ type: 'success', text: 'Publicación eliminada correctamente.' });
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <BlurText
            text="Administración de Productos y Servicios"
            animateBy="words"
            className="admin-module-title"
            as="h1"
          />
          <p className="admin-module-subtitle">
            Creá, modificá, eliminá y activá o desactivá las publicaciones del catálogo.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn btn-violet-glow">
          <Plus size={17} />
          <span>Nueva Publicación</span>
        </button>
      </div>

      {feedback.text && (
        <div
          className={`alert ${
            feedback.type === 'error' ? 'alert-error' : 'alert-success'
          }`}
        >
          <span>{feedback.text}</span>
        </div>
      )}

      {showForm && (
        <SpotlightCard className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <h3>{editingId ? 'Modificar Publicación' : 'Crear Nueva Publicación'}</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-ghost btn-sm"
            >
              <X size={16} />
              <span>Cerrar</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="vortex-form">
            <div className="form-row-2">
              <div className="form-group">
                <label>Nombre del Producto / Servicio *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Placa de Video RTX 4070 Ti Super"
                  className={errors.nombre ? 'input-error' : ''}
                />
                {errors.nombre && <span className="field-error">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className={errors.categoria ? 'input-error' : ''}
                >
                  <option value="">Seleccionar categoría...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <span className="field-error">{errors.categoria}</span>
                )}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Precio ($ ARS - opcional)</label>
                <input
                  type="number"
                  min="0"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  placeholder="Ej: 890000"
                  className={errors.precio ? 'input-error' : ''}
                />
                {errors.precio && <span className="field-error">{errors.precio}</span>}
              </div>

              <div className="form-group checkbox-group-row">
                <label className="checkbox-pill">
                  <input
                    type="checkbox"
                    checked={form.disponible}
                    onChange={(e) =>
                      setForm({ ...form, disponible: e.target.checked })
                    }
                  />
                  <span>Publicación Activa / Disponible</span>
                </label>

                <label className="checkbox-pill">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) =>
                      setForm({ ...form, destacado: e.target.checked })
                    }
                  />
                  <span>Destacar en Portada</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Especificaciones técnicas y detalles..."
                className={errors.descripcion ? 'input-error' : ''}
              />
              {errors.descripcion && (
                <span className="field-error">{errors.descripcion}</span>
              )}
            </div>

            <div className="form-group">
              <div className="multi-image-header">
                <label>Imágenes de la publicación (URLs - soporta múltiples)</label>
                <button
                  type="button"
                  onClick={addImageField}
                  className="btn btn-outline-violet btn-sm"
                >
                  <ImageIcon size={14} />
                  <span>+ Agregar otra imagen</span>
                </button>
              </div>
              {form.imagenes.map((url, idx) => (
                <div key={idx} className="multi-image-row">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={url}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                  />
                  {form.imagenes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      className="btn btn-ghost btn-sm"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions-row">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-violet-glow"
              >
                <Save size={16} />
                <span>
                  {saving
                    ? 'Guardando...'
                    : editingId
                    ? 'Guardar Cambios'
                    : 'Crear Publicación'}
                </span>
              </button>
            </div>
          </form>
        </SpotlightCard>
      )}

      <SpotlightCard className="admin-card">
        <div className="admin-card-header">
          <h3>Listado del Catálogo ({filteredProducts.length})</h3>
          <input
            type="text"
            placeholder="Filtrar por nombre..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="admin-filter-input"
          />
        </div>

        {loading ? (
          <div className="loading-state">Cargando publicaciones...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.nombre}</strong>
                      {p.destacado && (
                        <span className="mini-tag-featured">★ Destacado</span>
                      )}
                    </td>
                    <td>
                      {typeof p.categoria === 'object'
                        ? p.categoria?.name
                        : 'Categoría'}
                    </td>
                    <td>
                      {p.precio !== undefined && p.precio !== null
                        ? `$ ${Number(p.precio).toLocaleString('es-AR')}`
                        : 'Consultar'}
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          p.disponible ? 'status-available' : 'status-unavailable'
                        }`}
                      >
                        {p.disponible ? 'Activa' : 'Pausada'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() => handleToggleDisponible(p)}
                          className="btn btn-ghost btn-sm"
                          title={
                            p.disponible
                              ? 'Desactivar publicación'
                              : 'Activar publicación'
                          }
                        >
                          <Power size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="btn btn-ghost btn-sm"
                          title="Editar"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          className="btn btn-ghost btn-sm text-danger"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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

// ==================== 2. ADMINISTRACIÓN DE CATEGORÍAS ====================

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const validate = () => {
    const next = {};
    if (!name.trim() || name.trim().length < 2) {
      next.name = 'El nombre de la categoría debe tener al menos 2 caracteres.';
    } else if (name.trim().length > 50) {
      next.name = 'El nombre no puede superar los 50 caracteres.';
    }
    if (description.trim().length > 500) {
      next.description = 'La descripción no puede superar los 500 caracteres.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    if (!validate()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: name.trim(),
          description: description.trim()
        });
        setFeedback({ type: 'success', text: 'Categoría actualizada correctamente.' });
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim()
        });
        setFeedback({ type: 'success', text: 'Categoría creada correctamente.' });
      }
      setEditingId(null);
      setName('');
      setDescription('');
      await loadCategories();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setErrors({});
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    setFeedback({ type: '', text: '' });
    try {
      await deleteCategory(cat._id);
      setFeedback({ type: 'success', text: 'Categoría eliminada.' });
      await loadCategories();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <BlurText
            text="Administración de Categorías"
            animateBy="words"
            className="admin-module-title"
            as="h1"
          />
          <p className="admin-module-subtitle">
            Creá, modificá y eliminá categorías de productos. No se permite eliminar
            categorías con productos asociados.
          </p>
        </div>
      </div>

      {feedback.text && (
        <div
          className={`alert ${
            feedback.type === 'error' ? 'alert-error' : 'alert-success'
          }`}
        >
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="admin-split-grid">
        <SpotlightCard className="admin-card">
          <h3>{editingId ? 'Modificar Categoría' : 'Nueva Categoría'}</h3>
          <form onSubmit={handleSubmit} noValidate className="vortex-form">
            <div className="form-group">
              <label>Nombre de la Categoría *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Audio Profesional"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción de los productos incluidos..."
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && (
                <span className="field-error">{errors.description}</span>
              )}
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn btn-violet-glow">
                <Save size={16} />
                <span>{editingId ? 'Actualizar Categoría' : 'Crear Categoría'}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setDescription('');
                  }}
                  className="btn btn-ghost"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </SpotlightCard>

        <SpotlightCard className="admin-card">
          <h3>Categorías Registradas ({categories.length})</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <strong>{cat.name}</strong>
                    </td>
                    <td className="table-sub">{cat.description || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(cat)}
                          className="btn btn-ghost btn-sm"
                          title="Editar"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="btn btn-ghost btn-sm text-danger"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}

// ==================== 3. GESTIÓN DE CONSULTAS ====================

export function AdminConsultasPage() {
  const [consultas, setConsultas] = useState([]);
  const [filterEstado, setFilterEstado] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const loadConsultas = useCallback(async () => {
    try {
      const data = await getConsultas(filterEstado);
      setConsultas(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  }, [filterEstado]);

  useEffect(() => {
    loadConsultas();
  }, [loadConsultas]);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await updateEstadoConsulta(id, nuevoEstado);
      setFeedback({
        type: 'success',
        text: `Consulta marcada como "${nuevoEstado}".`
      });
      await loadConsultas();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta consulta de la bandeja?')) return;
    try {
      await deleteConsulta(id);
      setFeedback({ type: 'success', text: 'Consulta eliminada correctamente.' });
      await loadConsultas();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <BlurText
            text="Gestión de Consultas"
            animateBy="words"
            className="admin-module-title"
            as="h1"
          />
          <p className="admin-module-subtitle">
            Visualizá las consultas recibidas, cambialas a pendiente, leída o
            respondida, o eliminalas.
          </p>
        </div>

        <div className="category-pills-bar" style={{ marginBottom: 0 }}>
          {[
            { value: '', label: 'Todas' },
            { value: 'pendiente', label: 'Pendientes' },
            { value: 'leida', label: 'Leídas' },
            { value: 'respondida', label: 'Respondidas' }
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilterEstado(tab.value)}
              className={`cat-filter-pill ${
                filterEstado === tab.value ? 'is-active' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {feedback.text && (
        <div
          className={`alert ${
            feedback.type === 'error' ? 'alert-error' : 'alert-success'
          }`}
        >
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="consultas-cards-stack">
        {consultas.length === 0 ? (
          <SpotlightCard className="admin-card">
            <p className="text-muted">No hay consultas para el filtro seleccionado.</p>
          </SpotlightCard>
        ) : (
          consultas.map((c) => (
            <SpotlightCard key={c._id} className="consulta-item-card">
              <div className="consulta-item-top">
                <div>
                  <h3 className="consulta-asunto">{c.asunto}</h3>
                  <div className="consulta-meta">
                    <strong>{c.nombre}</strong> • <span>{c.email}</span>
                    {c.telefono && <span> • Tel: {c.telefono}</span>}
                  </div>
                </div>
                <span className={`consulta-badge estado-${c.estado}`}>
                  {c.estado}
                </span>
              </div>

              <p className="consulta-mensaje">{c.mensaje}</p>

              <div className="consulta-item-footer">
                <div className="estado-buttons-group">
                  <span>Cambiar estado:</span>
                  {['pendiente', 'leida', 'respondida'].map((est) => (
                    <button
                      key={est}
                      type="button"
                      onClick={() => handleEstadoChange(c._id, est)}
                      className={`btn btn-sm ${
                        c.estado === est ? 'btn-violet' : 'btn-ghost'
                      }`}
                    >
                      {est.charAt(0).toUpperCase() + est.slice(1)}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(c._id)}
                  className="btn btn-ghost btn-sm text-danger"
                >
                  <Trash2 size={15} />
                  <span>Eliminar</span>
                </button>
              </div>
            </SpotlightCard>
          ))
        )}
      </div>
    </div>
  );
}

// ==================== 4. INFORMACIÓN INSTITUCIONAL ====================

export function AdminInfoComercioPage() {
  const { info, saveInfo } = useStore();
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    email: '',
    horarios: '',
    instagram: '',
    facebook: '',
    whatsapp: ''
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (info) {
      setForm({
        nombre: info.nombre || '',
        descripcion: info.descripcion || '',
        direccion: info.direccion || '',
        telefono: info.telefono || '',
        email: info.email || '',
        horarios: info.horarios || '',
        instagram: info.redesSociales?.instagram || '',
        facebook: info.redesSociales?.facebook || '',
        whatsapp: info.redesSociales?.whatsapp || ''
      });
    }
  }, [info]);

  const validate = () => {
    const next = {};
    if (!form.nombre.trim()) {
      next.nombre = 'El nombre del comercio es obligatorio.';
    }
    if (!form.descripcion.trim()) {
      next.descripcion = 'La descripción institucional es obligatoria.';
    }
    if (!form.direccion.trim()) {
      next.direccion = 'La dirección es obligatoria.';
    }
    if (!form.telefono.trim()) {
      next.telefono = 'El teléfono es obligatorio.';
    }
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'El correo electrónico no tiene un formato válido.';
    }
    if (!form.horarios.trim()) {
      next.horarios = 'Los horarios de atención son obligatorios.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    if (!validate()) return;

    setSaving(true);
    try {
      await saveInfo({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        direccion: form.direccion.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        horarios: form.horarios.trim(),
        redesSociales: {
          instagram: form.instagram.trim(),
          facebook: form.facebook.trim(),
          whatsapp: form.whatsapp.trim()
        }
      });
      setFeedback({
        type: 'success',
        text: 'Información institucional actualizada correctamente.'
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <BlurText
            text="Administración de Información Institucional"
            animateBy="words"
            className="admin-module-title"
            as="h1"
          />
          <p className="admin-module-subtitle">
            Modificá el nombre del comercio, descripción, dirección, teléfono,
            redes sociales y horarios de atención.
          </p>
        </div>
      </div>

      {feedback.text && (
        <div
          className={`alert ${
            feedback.type === 'error' ? 'alert-error' : 'alert-success'
          }`}
        >
          <CheckCircle2 size={18} />
          <span>{feedback.text}</span>
        </div>
      )}

      <SpotlightCard className="admin-card">
        <form onSubmit={handleSubmit} noValidate className="vortex-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Nombre del Comercio *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className={errors.nombre ? 'input-error' : ''}
              />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label>Correo electrónico institucional</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Descripción del Comercio *</label>
            <textarea
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className={errors.descripcion ? 'input-error' : ''}
            />
            {errors.descripcion && (
              <span className="field-error">{errors.descripcion}</span>
            )}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Dirección *</label>
              <input
                type="text"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className={errors.direccion ? 'input-error' : ''}
              />
              {errors.direccion && (
                <span className="field-error">{errors.direccion}</span>
              )}
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className={errors.telefono ? 'input-error' : ''}
              />
              {errors.telefono && (
                <span className="field-error">{errors.telefono}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Horarios de Atención *</label>
            <input
              type="text"
              value={form.horarios}
              onChange={(e) => setForm({ ...form, horarios: e.target.value })}
              className={errors.horarios ? 'input-error' : ''}
            />
            {errors.horarios && (
              <span className="field-error">{errors.horarios}</span>
            )}
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label>Instagram</label>
              <input
                type="text"
                placeholder="@usuario"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Facebook</label>
              <input
                type="text"
                placeholder="PaginaFacebook"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>WhatsApp</label>
              <input
                type="text"
                placeholder="1155554444"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn btn-violet-glow">
            <Save size={16} />
            <span>{saving ? 'Guardando...' : 'Guardar Información Institucional'}</span>
          </button>
        </form>
      </SpotlightCard>
    </div>
  );
}

// ==================== 5. PERFIL DEL ADMINISTRADOR ====================

export function AdminProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    apellido: '',
    email: '',
    telefono: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        password: ''
      });
    }
  }, [user]);

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'El nombre es obligatorio.';
    }
    if (!form.apellido.trim() || form.apellido.trim().length < 2) {
      next.apellido = 'El apellido es obligatorio.';
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Ingresá un correo electrónico válido.';
    }
    if (!form.telefono.trim() || form.telefono.trim().length < 6) {
      next.telefono = 'El teléfono es obligatorio.';
    }
    if (form.password && form.password.length < 6) {
      next.password = 'La nueva contraseña debe tener al menos 6 caracteres.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim()
      };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setForm((prev) => ({ ...prev, password: '' }));
      setFeedback({
        type: 'success',
        text: 'Datos personales actualizados correctamente.'
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <div>
          <BlurText
            text="Modificar Datos Personales"
            animateBy="words"
            className="admin-module-title"
            as="h1"
          />
          <p className="admin-module-subtitle">
            Actualizá tu nombre, apellido, correo electrónico, teléfono o contraseña.
          </p>
        </div>
      </div>

      {feedback.text && (
        <div
          className={`alert ${
            feedback.type === 'error' ? 'alert-error' : 'alert-success'
          }`}
        >
          <CheckCircle2 size={18} />
          <span>{feedback.text}</span>
        </div>
      )}

      <SpotlightCard className="admin-card">
        <form onSubmit={handleSubmit} noValidate className="vortex-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Apellido *</label>
              <input
                type="text"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                className={errors.apellido ? 'input-error' : ''}
              />
              {errors.apellido && (
                <span className="field-error">{errors.apellido}</span>
              )}
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Correo electrónico *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className={errors.telefono ? 'input-error' : ''}
              />
              {errors.telefono && (
                <span className="field-error">{errors.telefono}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Nueva Contraseña (dejar en blanco para mantener la actual)</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" disabled={saving} className="btn btn-violet-glow">
            <Save size={16} />
            <span>{saving ? 'Actualizando...' : 'Guardar Datos Personales'}</span>
          </button>
        </form>
      </SpotlightCard>
    </div>
  );
}

