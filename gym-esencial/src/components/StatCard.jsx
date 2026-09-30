import React from 'react';
import { Users, DollarSign, CalendarCheck, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';

const colorStyles = {
  blue: {
    bgLight: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    badgeBg: 'bg-blue-50 text-blue-700',
    icon: Users
  },
  green: {
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100',
    badgeBg: 'bg-emerald-50 text-emerald-700',
    icon: DollarSign
  },
  orange: {
    bgLight: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    badgeBg: 'bg-amber-50 text-amber-700',
    icon: Clock
  },
  purple: {
    bgLight: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-100',
    badgeBg: 'bg-indigo-50 text-indigo-700',
    icon: CalendarCheck
  }
};

export default function StatCard({
  title,
  value,
  color = "blue",
  subtitle = "↑ 12% vs mes anterior",
  icon: CustomIcon
}) {
  const style = colorStyles[color] || colorStyles.blue;
  const IconComponent = CustomIcon || style.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 tracking-wide">
            {title}
          </p>
          <h2 className="text-3xl font-extrabold text-blue-950 mt-2 tracking-tight">
            {value}
          </h2>
        </div>
        <div className={`w-12 h-12 rounded-xl ${style.bgLight} ${style.text} flex items-center justify-center border ${style.border} group-hover:scale-110 transition-transform`}>
          <IconComponent size={22} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <TrendingUp size={14} />
        <span>{subtitle}</span>
      </div>

      {/* Subtle indicator bar on bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
