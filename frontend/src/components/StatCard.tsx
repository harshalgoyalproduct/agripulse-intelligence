'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  unit?: string;
  subtext?: string;
}

const colorClasses = {
  primary: 'bg-blue-50 text-blue-600',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-yellow-50 text-yellow-600',
  danger: 'bg-red-50 text-red-600',
};

export function StatCard({
  label,
  value,
  change,
  icon,
  color = 'primary',
  unit = '',
  subtext,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {unit && <span className="text-gray-500 text-sm">{unit}</span>}
          </div>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>

      {change !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp size={16} className="text-agri-success" />
            ) : (
              <TrendingDown size={16} className="text-agri-danger" />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositive ? 'text-agri-success' : 'text-agri-danger'
              }`}
            >
              {Math.abs(change)}% vs last period
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
