import React from 'react';
import { Settings, Save, Shield, Clock, MapPin } from 'lucide-react';

export default function Configuracion() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Configuración del Gimnasio</h1>
        <p className="text-gray-500 text-sm">Parámetros generales de la sede, aforo y políticas de reserva</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <h3 className="font-extrabold text-base text-blue-950 pb-3 border-b border-gray-100">
          Datos de la Sede Principal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Comercial</label>
            <input type="text" defaultValue="GYM ESENCIAL - Sede Central" className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">NIT / Identificación Fiscal</label>
            <input type="text" defaultValue="901.458.789-2" className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Dirección</label>
            <input type="text" defaultValue="Av. Principal #45-12, Sector Poblado" className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono Recepción</label>
            <input type="text" defaultValue="+57 (4) 444 8900" className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
        </div>

        <h3 className="font-extrabold text-base text-blue-950 pb-3 border-b border-gray-100 pt-4">
          Reglas de Aforo & Torniquete QR
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Aforo Máximo Simultáneo</label>
            <input type="number" defaultValue="80" className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tolerancia Ingreso por Vencimiento</label>
            <input type="number" defaultValue="3" placeholder="Días" className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Anticipación Reserva de Clases</label>
            <input type="text" defaultValue="24 Horas" className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20">
            <Save size={16} />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
}
