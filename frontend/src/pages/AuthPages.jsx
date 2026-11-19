import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  LogIn,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { forgotPassword, resetPassword } from '../services/api';
import {
  AuroraBackground,
  BlurText,
  GradientText,
  SpotlightCard
} from '../components/reactbits/ReactBits';

export function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const next = {};
    if (!email.trim()) {
      next.email = 'El correo electrónico es obligatorio.';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'El formato del correo electrónico no es válido.';
    }
    if (!password) {
      next.password = 'La contraseña es obligatoria.';
    } else if (password.length < 6) {
      next.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      setServerError(err.message || 'Credenciales inválidas.');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@tienda.com');
    setPassword('admin123');
    setErrors({});
  };

  return (
    <AuroraBackground className="auth-page-bg">
      <div className="container auth-container">
        <SpotlightCard className="auth-card">
          <div className="auth-header">
            <div className="brand-icon-box">
              <ShieldCheck size={24} />
            </div>
            <BlurText
              text="Iniciar Sesión Administrador"
              animateBy="words"
              className="auth-title"
              as="h1"
            />
            <p className="auth-subtitle">
              Accedé al panel privado para gestionar productos, categorías, consultas
              e información institucional.
            </p>
          </div>

          <div className="demo-credentials-banner">
            <div>
              <strong>Credenciales precargadas (Seed):</strong>
              <span>admin@tienda.com / admin123</span>
            </div>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="btn btn-outline-violet btn-sm"
            >
              Autocompletar
            </button>
          </div>

          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate className="vortex-form">
            <div className="form-group">
              <label htmlFor="login-email">Correo electrónico *</label>
              <input
                id="login-email"
                type="email"
                placeholder="admin@tienda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Contraseña *</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="auth-aux-row">
              <Link to="/recuperar-clave" className="violet-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-violet-glow btn-lg btn-block"
            >
              <LogIn size={18} />
              <span>{loading ? 'Autenticando...' : 'Iniciar Sesión'}</span>
            </button>
          </form>

          <div className="auth-footer-links">
            <span>¿No tenés cuenta de administrador?</span>
            <Link to="/registro" className="violet-link">
              Registrate acá
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </AuroraBackground>
  );
}

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'El nombre es obligatorio (mínimo 2 caracteres).';
    }
    if (!form.apellido.trim() || form.apellido.trim().length < 2) {
      next.apellido = 'El apellido es obligatorio (mínimo 2 caracteres).';
    }
    if (!form.email.trim()) {
      next.email = 'El correo electrónico es obligatorio.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'El correo electrónico no es válido.';
    }
    if (!form.telefono.trim() || form.telefono.trim().length < 6) {
      next.telefono = 'El teléfono es obligatorio (mínimo 6 dígitos).';
    }
    if (!form.password || form.password.length < 6) {
      next.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Las contraseñas no coinciden.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    try {
      await register({
        name: form.name.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        telefono: form.telefono.trim(),
        password: form.password
      });
      navigate('/admin');
    } catch (err) {
      setServerError(err.message || 'No se pudo completar el registro.');
    }
  };

  return (
    <AuroraBackground className="auth-page-bg">
      <div className="container auth-container">
        <SpotlightCard className="auth-card auth-card-wide">
          <div className="auth-header">
            <div className="brand-icon-box">
              <UserPlus size={24} />
            </div>
            <BlurText
              text="Registro de Administrador"
              animateBy="words"
              className="auth-title"
              as="h1"
            />
            <p className="auth-subtitle">
              Creá una cuenta de administrador para gestionar el comercio. No se
              permiten correos electrónicos duplicados.
            </p>
          </div>

          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate className="vortex-form">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-name">Nombre *</label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  placeholder="Ej: Ignacio"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="reg-apellido">Apellido *</label>
                <input
                  id="reg-apellido"
                  name="apellido"
                  type="text"
                  placeholder="Ej: Ubaldi"
                  value={form.apellido}
                  onChange={handleChange}
                  className={errors.apellido ? 'input-error' : ''}
                />
                {errors.apellido && (
                  <span className="field-error">{errors.apellido}</span>
                )}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-email">Correo electrónico *</label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="correo@comercio.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="reg-telefono">Teléfono *</label>
                <input
                  id="reg-telefono"
                  name="telefono"
                  type="text"
                  placeholder="Ej: 11 5555-4444"
                  value={form.telefono}
                  onChange={handleChange}
                  className={errors.telefono ? 'input-error' : ''}
                />
                {errors.telefono && (
                  <span className="field-error">{errors.telefono}</span>
                )}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="reg-password">Contraseña * (mín. 6 caracteres)</label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm">Confirmar Contraseña *</label>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-violet-glow btn-lg btn-block"
            >
              <UserPlus size={18} />
              <span>{loading ? 'Registrando...' : 'Crear Cuenta Administrador'}</span>
            </button>
          </form>

          <div className="auth-footer-links">
            <span>¿Ya tenés una cuenta?</span>
            <Link to="/login" className="violet-link">
              Iniciar sesión
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </AuroraBackground>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Ingresá un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      setSuccess(
        res?.message ||
          'Si el email existe, enviamos las instrucciones para recuperar la contraseña.'
      );
    } catch (err) {
      setError(err.message || 'No se pudo procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="auth-page-bg">
      <div className="container auth-container">
        <SpotlightCard className="auth-card">
          <div className="auth-header">
            <div className="brand-icon-box">
              <KeyRound size={24} />
            </div>
            <BlurText
              text="Recuperar Contraseña"
              animateBy="words"
              className="auth-title"
              as="h1"
            />
            <p className="auth-subtitle">
              Ingresá tu correo electrónico para generar un token de restablecimiento.
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <div>
                <p style={{ margin: 0 }}>{success}</p>
                <Link
                  to="/reset-password"
                  className="violet-link"
                  style={{ display: 'inline-block', marginTop: 6 }}
                >
                  Tengo un token de recuperación →
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="vortex-form">
            <div className="form-group">
              <label htmlFor="forgot-email">Correo electrónico registrado *</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="admin@tienda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-violet-glow btn-lg btn-block"
            >
              <KeyRound size={18} />
              <span>{loading ? 'Enviando...' : 'Solicitar Recuperación'}</span>
            </button>
          </form>

          <div className="auth-footer-links">
            <Link to="/login" className="violet-link">
              <ArrowLeft size={14} style={{ marginRight: 4 }} />
              Volver al inicio de sesión
            </Link>
            <Link to="/reset-password" className="violet-link">
              Ingresar token manual
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </AuroraBackground>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!token.trim()) next.token = 'El token de recuperación es obligatorio.';
    if (!password || password.length < 6) {
      next.password = 'La nueva contraseña debe tener al menos 6 caracteres.';
    }
    if (confirmPassword !== password) {
      next.confirmPassword = 'Las contraseñas no coinciden.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await resetPassword(token.trim(), password);
      setSuccess(res?.message || 'Contraseña actualizada con éxito.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setServerError(err.message || 'Token inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="auth-page-bg">
      <div className="container auth-container">
        <SpotlightCard className="auth-card">
          <div className="auth-header">
            <div className="brand-icon-box">
              <KeyRound size={24} />
            </div>
            <BlurText
              text="Restablecer Contraseña"
              animateBy="words"
              className="auth-title"
              as="h1"
            />
            <p className="auth-subtitle">
              Ingresá el token recibido y definí tu nueva contraseña de administrador.
            </p>
          </div>

          {serverError && <div className="alert alert-error">{serverError}</div>}
          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <div>
                <span>{success}</span>{' '}
                <Link to="/login" className="violet-link">
                  Ir a Iniciar Sesión →
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="vortex-form">
            <div className="form-group">
              <label htmlFor="reset-token">Token de recuperación *</label>
              <input
                id="reset-token"
                type="text"
                placeholder="Pegá el token generado en consola o email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className={errors.token ? 'input-error' : ''}
              />
              {errors.token && <span className="field-error">{errors.token}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="reset-pass">Nueva contraseña * (mín. 6 caracteres)</label>
              <input
                id="reset-pass"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reset-confirm">Confirmar nueva contraseña *</label>
              <input
                id="reset-confirm"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && (
                <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-violet-glow btn-lg btn-block"
            >
              <span>{loading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}</span>
            </button>
          </form>

          <div className="auth-footer-links">
            <Link to="/login" className="violet-link">
              Volver al login
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </AuroraBackground>
  );
}

