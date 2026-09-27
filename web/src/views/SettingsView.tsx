import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Building,
  Save,
  CheckCircle2,
  Shield,
  Smartphone,
  MapPin,
  Users,
} from 'lucide-react';
import { api, GymSettings } from '../services/api';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<GymSettings>({
    id: 'singleton',
    gymName: 'APEX GYM & FITNESS',
    nit: '901.884.212-9',
    phone: '+57 310 892 4410',
    address: 'Av. Las Palmas #24-10, Zona Fitness',
    currency: 'COP ($)',
    maxCapacity: 80,
    alertCapacity: 70,
    openingHours: 'Lun - Vie: 5:00 AM - 10:00 PM | Sáb - Dom: 6:00 AM - 6:00 PM',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      if (data) setSettings(data);
    } catch (err) {
      console.error('Error cargando configuración:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '800px' }}>
      <div className="glass-card">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={22} color="#10b981" />
          <span>Configuración del Gimnasio & Negocio</span>
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '4px 0 1.5rem 0' }}>
          Personaliza los datos tributarios, aforo legal permitido y horarios de atención.
        </p>

        {savedSuccess && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            color: '#10b981',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={18} />
            <span>Configuración guardada exitosamente en el servidor.</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Nombre Comercial del Gimnasio</label>
              <input
                type="text"
                required
                value={settings.gymName}
                onChange={(e) => setSettings({ ...settings, gymName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>NIT / RUT Tributario</label>
              <input
                type="text"
                required
                value={settings.nit}
                onChange={(e) => setSettings({ ...settings, nit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Teléfono de Atención / WhatsApp</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Dirección de la Sede</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Capacidad Máxima (Aforo)</label>
              <input
                type="number"
                value={settings.maxCapacity}
                onChange={(e) => setSettings({ ...settings, maxCapacity: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Alerta de Sobrecupo</label>
              <input
                type="number"
                value={settings.alertCapacity}
                onChange={(e) => setSettings({ ...settings, alertCapacity: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Moneda</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  marginTop: '4px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Horarios de Apertura y Cierre</label>
            <input
              type="text"
              value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#ffffff',
                marginTop: '4px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.35)',
            }}
          >
            <Save size={18} />
            <span>{loading ? 'Guardando...' : 'Guardar Configuración'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
