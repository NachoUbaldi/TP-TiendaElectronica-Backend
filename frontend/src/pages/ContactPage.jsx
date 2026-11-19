import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
  MessageCircle
} from 'lucide-react';
import { createConsulta } from '../services/api';
import { useStore } from '../context/StoreContext';
import { BlurText, GradientText, SpotlightCard } from '../components/reactbits/ReactBits';

export default function ContactPage() {
  const { info } = useStore();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: searchParams.get('asunto') || '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const nextErrors = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 2) {
      nextErrors.nombre = 'Ingresá tu nombre completo (mínimo 2 caracteres).';
    }
    if (!form.email.trim()) {
      nextErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      nextErrors.email = 'Ingresá un correo electrónico con formato válido.';
    }
    if (form.telefono.trim() && !/^[0-9+\-\s()]{6,25}$/.test(form.telefono.trim())) {
      nextErrors.telefono = 'El teléfono contiene caracteres inválidos.';
    }
    if (!form.asunto.trim() || form.asunto.trim().length < 3) {
      nextErrors.asunto = 'El asunto es obligatorio (mínimo 3 caracteres).';
    }
    if (!form.mensaje.trim() || form.mensaje.trim().length < 10) {
      nextErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createConsulta(form);
      setSuccessMsg(
        '¡Tu consulta fue enviada y registrada con éxito! Nuestro equipo te responderá a la brevedad.'
      );
      setForm({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
    } catch (err) {
      setServerError(err.message || 'Ocurrió un error al enviar la consulta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container container">
      <div className="catalog-header">
        <BlurText
          text="Información Institucional & Contacto"
          animateBy="words"
          className="page-title"
        />
        <p className="page-subtitle">
          Conocé nuestros canales oficiales de atención o envianos tu consulta directa.
        </p>
      </div>

      <div className="contact-layout-grid">
        {/* DATOS INSTITUCIONALES DEL COMERCIO */}
        <SpotlightCard className="contact-info-card">
          <span className="section-eyebrow">FICHA DEL COMERCIO</span>
          <h2 className="contact-store-name">
            <GradientText>{info?.nombre || 'Tienda Electrónica & Hardware'}</GradientText>
          </h2>
          <p className="contact-store-desc">{info?.descripcion}</p>

          <div className="contact-info-items">
            <div className="contact-info-row">
              <div className="contact-icon-box">
                <MapPin size={20} />
              </div>
              <div>
                <strong>Dirección</strong>
                <span>{info?.direccion || 'Av. Lima 123, CABA'}</span>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="contact-icon-box">
                <Phone size={20} />
              </div>
              <div>
                <strong>Teléfono</strong>
                <span>{info?.telefono || '011 5555-4444'}</span>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="contact-icon-box">
                <Mail size={20} />
              </div>
              <div>
                <strong>Correo electrónico</strong>
                <span>{info?.email || 'contacto@tiendaelectronica.com'}</span>
              </div>
            </div>

            <div className="contact-info-row">
              <div className="contact-icon-box">
                <Clock size={20} />
              </div>
              <div>
                <strong>Horarios de atención</strong>
                <span>
                  {info?.horarios || 'Lunes a Viernes de 9 a 18 hs | Sábados de 9 a 13 hs'}
                </span>
              </div>
            </div>
          </div>

          <div className="contact-socials">
            <h4>Redes Sociales</h4>
            <div className="social-row">
              {info?.redesSociales?.instagram && (
                <span className="social-pill">
                  <Instagram size={15} />
                  <span>{info.redesSociales.instagram}</span>
                </span>
              )}
              {info?.redesSociales?.facebook && (
                <span className="social-pill">
                  <Facebook size={15} />
                  <span>{info.redesSociales.facebook}</span>
                </span>
              )}
              {info?.redesSociales?.whatsapp && (
                <span className="social-pill">
                  <MessageCircle size={15} />
                  <span>WhatsApp: {info.redesSociales.whatsapp}</span>
                </span>
              )}
            </div>
          </div>
        </SpotlightCard>

        {/* FORMULARIO DE CONTACTO */}
        <SpotlightCard className="contact-form-card">
          <h3>Enviar una Consulta al Comercio</h3>
          <p className="form-helper-text">
            Completá los datos requeridos (*). Tu mensaje quedará almacenado para que
            el administrador del comercio lo gestione.
          </p>

          {serverError && <div className="alert alert-error">{serverError}</div>}
          {successMsg && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="vortex-form">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="nombre">Nombre y Apellido *</label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={form.nombre}
                  onChange={handleChange}
                  className={errors.nombre ? 'input-error' : ''}
                />
                {errors.nombre && <span className="field-error">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="telefono">Teléfono (opcional)</label>
                <input
                  id="telefono"
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

              <div className="form-group">
                <label htmlFor="asunto">Asunto *</label>
                <input
                  id="asunto"
                  name="asunto"
                  type="text"
                  placeholder="Motivo de tu consulta"
                  value={form.asunto}
                  onChange={handleChange}
                  className={errors.asunto ? 'input-error' : ''}
                />
                {errors.asunto && <span className="field-error">{errors.asunto}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mensaje">Mensaje *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                placeholder="Escribí tu consulta detallada..."
                value={form.mensaje}
                onChange={handleChange}
                className={errors.mensaje ? 'input-error' : ''}
              />
              {errors.mensaje && <span className="field-error">{errors.mensaje}</span>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-violet-glow btn-lg"
            >
              <Send size={17} />
              <span>{submitting ? 'Enviando consulta...' : 'Enviar Consulta'}</span>
            </button>
          </form>
        </SpotlightCard>
      </div>
    </div>
  );
}

