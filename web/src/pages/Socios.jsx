import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, CheckCircle, Clock, XCircle, Mail, Phone, QrCode, X } from 'lucide-react';

const mockMembers = [
  { id: 'SOC-101', name: 'Carlos Mendoza', email: 'carlos.m@gmail.com', phone: '+57 312 456 7890', plan: 'Plan Black VIP', status: 'Activo', expires: '15/11/2026', attendance: 24 },
  { id: 'SOC-102', name: 'Andrea Torres', email: 'andrea.t@hotmail.com', phone: '+57 301 987 6543', plan: 'Plan Mensual Oro', status: 'Activo', expires: '02/10/2026', attendance: 18 },
  { id: 'SOC-103', name: 'Sebastián Vélez', email: 's.velez@outlook.com', phone: '+57 320 111 2233', plan: 'Plan Estudiante', status: 'Vencido', expires: '28/09/2026', attendance: 12 },
  { id: 'SOC-104', name: 'Mariana Duarte', email: 'mariana.d@gmail.com', phone: '+57 315 444 5566', plan: 'Plan Black VIP', status: 'Activo', expires: '30/12/2026', attendance: 30 },
  { id: 'SOC-105', name: 'Felipe Morales', email: 'felipe.m@yahoo.com', phone: '+57 318 777 8899', plan: 'Pase 10 Visitas', status: 'Pendiente', expires: '10/10/2026', attendance: 4 },
  { id: 'SOC-106', name: 'Valentina Osorio', email: 'valen.o@gmail.com', phone: '+57 300 222 3344', plan: 'Plan Mensual Oro', status: 'Activo', expires: '20/10/2026', attendance: 15 },
];

export default function Socios() {
  const [members, setMembers] = useState(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Plan Black VIP',
    status: 'Activo'
  });

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || m.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name) return;
    const item = {
      id: `SOC-${Math.floor(100 + Math.random() * 900)}`,
      name: newMember.name,
      email: newMember.email || 'socio@gym.com',
      phone: newMember.phone || '+57 300 000 0000',
      plan: newMember.plan,
      status: newMember.status,
      expires: '30/11/2026',
      attendance: 0
    };
    setMembers([item, ...members]);
    setModalOpen(false);
    setNewMember({ name: '', email: '', phone: '', plan: 'Plan Black VIP', status: 'Activo' });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Directorio de Socios</h1>
          <p className="text-gray-500 text-sm">Gestiona altas, membresías, estados y accesos</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus size={18} />
          <span>Registrar Socio</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['Todos', 'Activo', 'Pendiente', 'Vencido'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">Socio</th>
                <th className="py-4 px-6">Contacto</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6">Vencimiento</th>
                <th className="py-4 px-6 text-center">Asistencias</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-sm shadow-inner">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{member.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-gray-400" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-gray-400" />
                      <span>{member.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg text-xs border border-blue-100">
                      {member.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        member.status === 'Activo'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : member.status === 'Pendiente'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        member.status === 'Activo' ? 'bg-emerald-500' : member.status === 'Pendiente' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs font-medium text-gray-600">
                    {member.expires}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-gray-700">
                    {member.attendance} días
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-xs px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Member */}
      {modalOpen && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-extrabold text-lg text-blue-900">Nuevo Registro de Socio</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Daniel Restrepo"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="socio@ejemplo.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+57 300 123 4567"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Plan de Membresía</label>
                <select
                  value={newMember.plan}
                  onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Plan Black VIP">Plan Black VIP ($149.000/mes)</option>
                  <option value="Plan Mensual Oro">Plan Mensual Oro ($99.000/mes)</option>
                  <option value="Plan Estudiante">Plan Estudiante ($79.000/mes)</option>
                  <option value="Pase 10 Visitas">Pase 10 Visitas ($65.000)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20"
                >
                  Guardar Socio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
