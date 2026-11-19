import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage
} from './pages/AuthPages';
import { AdminLayout, AdminDashboard } from './pages/admin/AdminLayout';
import {
  AdminProductsPage,
  AdminCategoriesPage,
  AdminConsultasPage,
  AdminInfoComercioPage,
  AdminProfilePage
} from './pages/admin/AdminModules';

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* SITIO PÚBLICO (VISITANTE) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/contacto" element={<ContactPage />} />

          {/* AUTENTICACIÓN */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-clave" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* PANEL PRIVADO (ADMINISTRADOR) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProductsPage />} />
            <Route path="categorias" element={<AdminCategoriesPage />} />
            <Route path="consultas" element={<AdminConsultasPage />} />
            <Route path="comercio" element={<AdminInfoComercioPage />} />
            <Route path="perfil" element={<AdminProfilePage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

