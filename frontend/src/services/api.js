import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_INFO,
  INITIAL_CONSULTAS
} from './fallbackData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const STORAGE_KEYS = {
  TOKEN: 'vortex_token',
  USER: 'vortex_user',
  FB_CATEGORIES: 'vortex_fb_categories',
  FB_PRODUCTS: 'vortex_fb_products',
  FB_INFO: 'vortex_fb_info',
  FB_CONSULTAS: 'vortex_fb_consultas',
  FB_USERS: 'vortex_fb_users'
};

let isOfflineFallback = false;
const listeners = new Set();

export function onConnectionModeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setOfflineMode(val) {
  if (isOfflineFallback !== val) {
    isOfflineFallback = val;
    listeners.forEach((fn) => fn(val));
  }
}

export function getIsOfflineMode() {
  return isOfflineFallback;
}

function readLocal(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return JSON.parse(JSON.stringify(initial));
    }
    return JSON.parse(raw);
  } catch {
    return JSON.parse(JSON.stringify(initial));
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-access-token'] = token;
  }
  return headers;
}

async function request(path, options = {}, fallbackFn = null) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      }
    });

    setOfflineMode(false);

    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text };
    }

    if (!res.ok) {
      const errMsg =
        data?.message ||
        data?.mensaje ||
        data?.error ||
        `Error HTTP ${res.status}`;
      const error = new Error(errMsg);
      error.status = res.status;
      throw error;
    }

    return data;
  } catch (err) {
    // Only use fallback if it's a network connectivity error (TypeError: Failed to fetch)
    if (err.name === 'TypeError' && fallbackFn) {
      setOfflineMode(true);
      return await fallbackFn();
    }
    throw err;
  }
}

// ==================== PRODUCTOS (/api/products) ====================

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.nombre) params.set('nombre', filters.nombre);
  if (filters.search) params.set('search', filters.search);
  if (filters.categoria) params.set('categoria', filters.categoria);
  if (filters.disponible !== undefined && filters.disponible !== '') {
    params.set('disponible', String(filters.disponible));
  }
  if (filters.destacado !== undefined && filters.destacado !== '') {
    params.set('destacado', String(filters.destacado));
  }
  if (filters.minPrecio !== undefined && filters.minPrecio !== '') {
    params.set('minPrecio', String(filters.minPrecio));
  }
  if (filters.maxPrecio !== undefined && filters.maxPrecio !== '') {
    params.set('maxPrecio', String(filters.maxPrecio));
  }
  const qs = params.toString() ? `?${params.toString()}` : '';

  return request(`/products${qs}`, { method: 'GET' }, () => {
    let list = readLocal(STORAGE_KEYS.FB_PRODUCTS, INITIAL_PRODUCTS);
    if (filters.nombre) {
      const q = filters.nombre.toLowerCase();
      list = list.filter((p) => p.nombre.toLowerCase().includes(q));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q)
      );
    }
    if (filters.categoria) {
      list = list.filter(
        (p) =>
          p.categoria?._id === filters.categoria ||
          p.categoria === filters.categoria ||
          p.categoria?.name?.toLowerCase() === filters.categoria.toLowerCase()
      );
    }
    if (filters.disponible === true || filters.disponible === 'true') {
      list = list.filter((p) => p.disponible === true);
    } else if (filters.disponible === false || filters.disponible === 'false') {
      list = list.filter((p) => p.disponible === false);
    }
    if (filters.destacado === true || filters.destacado === 'true') {
      list = list.filter((p) => p.destacado === true);
    }
    if (filters.minPrecio !== undefined && filters.minPrecio !== '') {
      list = list.filter((p) => Number(p.precio || 0) >= Number(filters.minPrecio));
    }
    if (filters.maxPrecio !== undefined && filters.maxPrecio !== '') {
      list = list.filter((p) => Number(p.precio || 0) <= Number(filters.maxPrecio));
    }
    return list;
  });
}

export async function getProductById(id) {
  return request(`/products/${id}`, { method: 'GET' }, () => {
    const list = readLocal(STORAGE_KEYS.FB_PRODUCTS, INITIAL_PRODUCTS);
    const found = list.find((p) => p._id === id);
    if (!found) throw new Error('Producto no encontrado');
    return found;
  });
}

export async function createProduct(payload) {
  return request(
    '/products',
    { method: 'POST', body: JSON.stringify(payload) },
    () => {
      const cats = readLocal(STORAGE_KEYS.FB_CATEGORIES, INITIAL_CATEGORIES);
      const catObj =
        cats.find((c) => c._id === payload.categoria || c.name === payload.categoria) ||
        cats[0];
      const list = readLocal(STORAGE_KEYS.FB_PRODUCTS, INITIAL_PRODUCTS);
      const nuevo = {
        _id: 'prod-' + Date.now(),
        nombre: payload.nombre,
        categoria: { _id: catObj._id, name: catObj.name },
        descripcion: payload.descripcion,
        imagenes: Array.isArray(payload.imagenes) ? payload.imagenes : [],
        precio: payload.precio !== '' && payload.precio !== undefined ? Number(payload.precio) : undefined,
        disponible: payload.disponible !== undefined ? Boolean(payload.disponible) : true,
        destacado: Boolean(payload.destacado)
      };
      list.unshift(nuevo);
      writeLocal(STORAGE_KEYS.FB_PRODUCTS, list);
      return { mensaje: 'Producto creado con éxito', producto: nuevo };
    }
  );
}

export async function updateProduct(id, payload) {
  return request(
    `/products/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) },
    () => {
      const cats = readLocal(STORAGE_KEYS.FB_CATEGORIES, INITIAL_CATEGORIES);
      const list = readLocal(STORAGE_KEYS.FB_PRODUCTS, INITIAL_PRODUCTS);
      const idx = list.findIndex((p) => p._id === id);
      if (idx === -1) throw new Error('Producto no encontrado');
      const catObj =
        cats.find((c) => c._id === payload.categoria || c.name === payload.categoria) ||
        list[idx].categoria;
      const updated = {
        ...list[idx],
        ...payload,
        categoria: { _id: catObj._id, name: catObj.name }
      };
      list[idx] = updated;
      writeLocal(STORAGE_KEYS.FB_PRODUCTS, list);
      return { mensaje: 'Producto actualizado con éxito', producto: updated };
    }
  );
}

export async function toggleProductDisponible(id, disponible) {
  return request(
    `/products/${id}/disponible`,
    { method: 'PATCH', body: JSON.stringify({ disponible }) },
    () => {
      const list = readLocal(STORAGE_KEYS.FB_PRODUCTS, INITIAL_PRODUCTS);
      const idx = list.findIndex((p) => p._id === id);
      if (idx === -1) throw new Error('Producto no encontrado');
      list[idx].disponible = Boolean(disponible);
      writeLocal(STORAGE_KEYS.FB_PRODUCTS, list);
      return {
        mensaje: disponible ? 'Producto activado' : 'Producto desactivado',
        producto: list[idx]
      };
    }
  );
}

export async function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' }, () => {
    const list = readLocal(STORAGE_KEYS.FB_PRODUCTS, INITIAL_PRODUCTS);
    writeLocal(
      STORAGE_KEYS.FB_PRODUCTS,
      list.filter((p) => p._id !== id)
    );
    return { mensaje: 'Producto eliminado correctamente del catálogo' };
  });
}

// ==================== CATEGORÍAS (/api/categories) ====================

export async function getCategories() {
  return request('/categories', { method: 'GET' }, () =>
    readLocal(STORAGE_KEYS.FB_CATEGORIES, INITIAL_CATEGORIES)
  );
}

export async function createCategory(payload) {
  return request(
    '/categories',
    { method: 'POST', body: JSON.stringify(payload) },
    () => {
      const list = readLocal(STORAGE_KEYS.FB_CATEGORIES, INITIAL_CATEGORIES);
      if (list.some((c) => c.name.toLowerCase() === payload.name.trim().toLowerCase())) {
        throw new Error('Ya existe una categoría con ese nombre');
      }
      const nueva = {
        _id: 'cat-' + Date.now(),
        name: payload.name.trim(),
        description: payload.description?.trim() || ''
      };
      list.push(nueva);
      writeLocal(STORAGE_KEYS.FB_CATEGORIES, list);
      return nueva;
    }
  );
}

export async function updateCategory(id, payload) {
  return request(
    `/categories/${id}`,
    { method: 'PUT', body: JSON.stringify(payload) },
    () => {
      const list = readLocal(STORAGE_KEYS.FB_CATEGORIES, INITIAL_CATEGORIES);
      const idx = list.findIndex((c) => c._id === id);
      if (idx === -1) throw new Error('Categoría no encontrada');
      if (
        list.some(
          (c, i) =>
            i !== idx && c.name.toLowerCase() === payload.name.trim().toLowerCase()
        )
      ) {
        throw new Error('Ya existe una categoría con ese nombre');
      }
      list[idx] = { ...list[idx], ...payload };
      writeLocal(STORAGE_KEYS.FB_CATEGORIES, list);
      return list[idx];
    }
  );
}

export async function deleteCategory(id) {
  return request(`/categories/${id}`, { method: 'DELETE' }, () => {
    const prods = readLocal(STORAGE_KEYS.FB_PRODUCTS, INITIAL_PRODUCTS);
    const hasProds = prods.some(
      (p) => p.categoria?._id === id || p.categoria === id
    );
    if (hasProds) {
      throw new Error(
        'No se puede eliminar la categoría porque tiene productos asociados'
      );
    }
    const list = readLocal(STORAGE_KEYS.FB_CATEGORIES, INITIAL_CATEGORIES);
    writeLocal(
      STORAGE_KEYS.FB_CATEGORIES,
      list.filter((c) => c._id !== id)
    );
    return { message: 'Categoría eliminada correctamente' };
  });
}

// ==================== INFO COMERCIO (/api/info) ====================

export async function getInfoComercio() {
  return request('/info', { method: 'GET' }, () =>
    readLocal(STORAGE_KEYS.FB_INFO, INITIAL_INFO)
  );
}

export async function updateInfoComercio(payload) {
  return request(
    '/info',
    { method: 'PUT', body: JSON.stringify(payload) },
    () => {
      const current = readLocal(STORAGE_KEYS.FB_INFO, INITIAL_INFO);
      const updated = { ...current, ...payload };
      writeLocal(STORAGE_KEYS.FB_INFO, updated);
      return updated;
    }
  );
}

// ==================== CONSULTAS (/api/consultas) ====================

export async function createConsulta(payload) {
  return request(
    '/consultas',
    { method: 'POST', body: JSON.stringify(payload) },
    () => {
      const list = readLocal(STORAGE_KEYS.FB_CONSULTAS, INITIAL_CONSULTAS);
      const consulta = {
        _id: 'cons-' + Date.now(),
        nombre: payload.nombre.trim(),
        email: payload.email.trim().toLowerCase(),
        telefono: payload.telefono?.trim() || '',
        asunto: payload.asunto.trim(),
        mensaje: payload.mensaje.trim(),
        estado: 'pendiente',
        createdAt: new Date().toISOString()
      };
      list.unshift(consulta);
      writeLocal(STORAGE_KEYS.FB_CONSULTAS, list);
      return { message: 'Consulta enviada con éxito', consulta };
    }
  );
}

export async function getConsultas(estado = '') {
  const qs = estado ? `?estado=${encodeURIComponent(estado)}` : '';
  return request(`/consultas${qs}`, { method: 'GET' }, () => {
    const list = readLocal(STORAGE_KEYS.FB_CONSULTAS, INITIAL_CONSULTAS);
    if (!estado) return list;
    return list.filter((c) => c.estado === estado);
  });
}

export async function updateEstadoConsulta(id, estado) {
  return request(
    `/consultas/${id}/estado`,
    { method: 'PUT', body: JSON.stringify({ estado }) },
    () => {
      const list = readLocal(STORAGE_KEYS.FB_CONSULTAS, INITIAL_CONSULTAS);
      const idx = list.findIndex((c) => c._id === id);
      if (idx === -1) throw new Error('Consulta no encontrada');
      list[idx].estado = estado;
      writeLocal(STORAGE_KEYS.FB_CONSULTAS, list);
      return list[idx];
    }
  );
}

export async function deleteConsulta(id) {
  return request(`/consultas/${id}`, { method: 'DELETE' }, () => {
    const list = readLocal(STORAGE_KEYS.FB_CONSULTAS, INITIAL_CONSULTAS);
    writeLocal(
      STORAGE_KEYS.FB_CONSULTAS,
      list.filter((c) => c._id !== id)
    );
    return { message: 'Consulta eliminada correctamente' };
  });
}

// ==================== USUARIOS & AUTH (/api/users) ====================

const DEFAULT_ADMIN = {
  _id: 'admin-1',
  name: 'Admin',
  apellido: 'Tienda',
  email: 'admin@tienda.com',
  telefono: '1155554444',
  role: 'admin'
};

export async function loginUser(email, password) {
  return request(
    '/users/login/',
    { method: 'POST', body: JSON.stringify({ email, password }) },
    () => {
      const users = readLocal(STORAGE_KEYS.FB_USERS, [
        { ...DEFAULT_ADMIN, password: 'admin123' }
      ]);
      const found = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );
      if (!found) {
        throw new Error('Error en el usuario o en la contraseña');
      }
      const { password: _, ...safeUser } = found;
      return {
        loginUser: {
          token: 'fb-jwt-token-' + Date.now(),
          user: safeUser
        },
        message: 'Succesfully login'
      };
    }
  );
}

export async function registerUser(payload) {
  return request(
    '/users/registration',
    { method: 'POST', body: JSON.stringify(payload) },
    () => {
      const users = readLocal(STORAGE_KEYS.FB_USERS, [
        { ...DEFAULT_ADMIN, password: 'admin123' }
      ]);
      if (
        users.some(
          (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
        )
      ) {
        throw new Error('El email ya está registrado');
      }
      const newUser = {
        _id: 'user-' + Date.now(),
        name: payload.name.trim(),
        apellido: payload.apellido.trim(),
        email: payload.email.trim().toLowerCase(),
        telefono: payload.telefono.trim(),
        password: payload.password,
        role: 'admin'
      };
      users.push(newUser);
      writeLocal(STORAGE_KEYS.FB_USERS, users);
      return {
        createdUser: 'fb-jwt-token-' + Date.now(),
        message: 'Succesfully Created User'
      };
    }
  );
}

export async function logoutUser() {
  return request('/users/logout', { method: 'POST' }, () => ({
    status: 200,
    message: 'Logout exitoso'
  }));
}

export async function getUserProfile() {
  return request('/users/profile', { method: 'GET' }, () => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    const current = raw ? JSON.parse(raw) : DEFAULT_ADMIN;
    return { status: 200, data: current };
  });
}

export async function updateUserProfile(payload) {
  return request(
    '/users/update',
    { method: 'PUT', body: JSON.stringify(payload) },
    () => {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      const current = raw ? JSON.parse(raw) : DEFAULT_ADMIN;
      const users = readLocal(STORAGE_KEYS.FB_USERS, [
        { ...DEFAULT_ADMIN, password: 'admin123' }
      ]);
      if (
        payload.email &&
        users.some(
          (u) =>
            u._id !== current._id &&
            u.email.toLowerCase() === payload.email.trim().toLowerCase()
        )
      ) {
        throw new Error('El email ya está registrado');
      }
      const updated = {
        ...current,
        name: payload.name || current.name,
        apellido: payload.apellido || current.apellido,
        email: payload.email || current.email,
        telefono: payload.telefono || current.telefono
      };
      const idx = users.findIndex((u) => u._id === current._id);
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          ...updated,
          password: payload.password || users[idx].password
        };
        writeLocal(STORAGE_KEYS.FB_USERS, users);
      }
      return { status: 200, data: updated };
    }
  );
}

export async function forgotPassword(email) {
  return request(
    '/users/forgot-password',
    { method: 'POST', body: JSON.stringify({ email }) },
    () => ({
      status: 200,
      message:
        'Si el email existe, enviamos las instrucciones para recuperar la contraseña.'
    })
  );
}

export async function resetPassword(token, password) {
  return request(
    '/users/reset-password',
    { method: 'POST', body: JSON.stringify({ token, password }) },
    () => ({
      status: 200,
      message: 'Contraseña actualizada con éxito.'
    })
  );
}

export { STORAGE_KEYS };

