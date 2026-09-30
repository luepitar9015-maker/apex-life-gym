import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, Tag } from 'lucide-react';

const mockItems = [
  { id: 'INV-01', name: 'Proteína Whey Isolate 2lb', category: 'Suplementos', stock: 14, minStock: 5, price: '$140.000', status: 'Disponible' },
  { id: 'INV-02', name: 'Creatina Monohidratada 300g', category: 'Suplementos', stock: 3, minStock: 6, price: '$85.000', status: 'Bajo Stock' },
  { id: 'INV-03', name: 'Shaker Pro Mezclador 700ml', category: 'Accesorios', stock: 28, minStock: 10, price: '$25.000', status: 'Disponible' },
  { id: 'INV-04', name: 'Bebida Isotónica Hidratante', category: 'Bebidas', stock: 42, minStock: 15, price: '$6.500', status: 'Disponible' },
  { id: 'INV-05', name: 'Straps de Agarre para Peso Muerto', category: 'Accesorios', stock: 8, minStock: 5, price: '$35.000', status: 'Disponible' },
];

export default function Inventario() {
  const [items, setItems] = useState(mockItems);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Inventario & Tienda</h1>
          <p className="text-gray-500 text-sm">Control de stock de suplementos, accesorios e indumentaria</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all">
          <Plus size={18} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">Producto</th>
                <th className="py-4 px-6">Categoría</th>
                <th className="py-4 px-6">Precio Venta</th>
                <th className="py-4 px-6">Stock Actual</th>
                <th className="py-4 px-6">Estado</th>
                <th className="py-4 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30">
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-blue-950">{item.price}</td>
                  <td className="py-4 px-6 font-bold text-gray-700">{item.stock} unidades</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.status === 'Disponible' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {item.status === 'Bajo Stock' && <AlertTriangle size={12} />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline">
                      Ajustar Stock
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
