import React, { useState } from 'react';
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle, Clock, Plus, Download, Search } from 'lucide-react';

const mockPayments = [
  { id: 'REC-501', member: 'Carlos Mendoza', concept: 'Mensualidad Plan Black VIP', amount: '$149.000', method: 'Tarjeta Crédito', date: '29/09/2026 10:30', status: 'Aprobado' },
  { id: 'REC-502', member: 'Andrea Torres', concept: 'Mensualidad Oro + Locker', amount: '$115.000', method: 'Transferencia Bancolombia', date: '29/09/2026 09:15', status: 'Aprobado' },
  { id: 'REC-503', member: 'Sebastián Vélez', concept: 'Renovación Estudiante', amount: '$79.000', method: 'Efectivo', date: '28/09/2026 18:20', status: 'Pendiente' },
  { id: 'REC-504', member: 'Mariana Duarte', concept: 'Suplemento Proteína Whey + Shaker', amount: '$180.000', method: 'Datafono', date: '28/09/2026 16:40', status: 'Aprobado' },
  { id: 'REC-505', member: 'Felipe Morales', concept: 'Pase 10 Visitas', amount: '$65.000', method: 'Nequi / Daviplata', date: '27/09/2026 11:05', status: 'Aprobado' },
];

export default function Pagos() {
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Caja & Facturación</h1>
          <p className="text-gray-500 text-sm">Control de ingresos, cobros pendientes y comprobantes de pago</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all">
          <Plus size={18} />
          <span>Registrar Pago / Cobro</span>
        </button>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">Recaudado Hoy</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-1">$444.000</h3>
            <span className="text-[11px] text-emerald-600 font-bold">12 transacciones</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">Total Ingresos del Mes</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-1">$125.430.000</h3>
            <span className="text-[11px] text-blue-600 font-bold">Meta cumplida al 104%</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <CreditCard size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">Cobros Pendientes</p>
            <h3 className="text-2xl font-extrabold text-amber-900 mt-1">12 Cuotas</h3>
            <span className="text-[11px] text-amber-600 font-bold">$1.450.000 por recaudar</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-blue-900">Historial de Transacciones Recientes</h3>
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar recibo o socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3 px-6">ID Comprobante</th>
                <th className="py-3 px-6">Socio</th>
                <th className="py-3 px-6">Concepto</th>
                <th className="py-3 px-6">Monto</th>
                <th className="py-3 px-6">Método de Pago</th>
                <th className="py-3 px-6">Fecha</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-blue-700">{p.id}</td>
                  <td className="py-3.5 px-6 font-bold text-gray-800">{p.member}</td>
                  <td className="py-3.5 px-6 text-xs text-gray-600">{p.concept}</td>
                  <td className="py-3.5 px-6 font-extrabold text-blue-950">{p.amount}</td>
                  <td className="py-3.5 px-6 text-xs text-gray-600">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{p.method}</span>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-gray-500">{p.date}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.status === 'Aprobado'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <Download size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
