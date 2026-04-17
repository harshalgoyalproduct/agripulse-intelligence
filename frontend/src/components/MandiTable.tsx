'use client';

import { useState } from 'react';
import { MandiPrice } from '../lib/api';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MandiTableProps {
  data: MandiPrice[];
  loading?: boolean;
  compact?: boolean;
}

export function MandiTable({ data, loading, compact = false }: MandiTableProps) {
  const [sortField, setSortField] = useState<keyof MandiPrice>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  if (loading) {
    return (
      <div className="card flex items-center justify-center h-64">
        <div className="text-gray-500">Loading mandi prices...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card flex items-center justify-center h-64">
        <div className="text-gray-500">No mandi data available</div>
      </div>
    );
  }

  const handleSort = (field: keyof MandiPrice) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aStr = String(aValue);
    const bStr = String(bValue);
    return sortDir === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const displayData = compact ? sortedData.slice(0, 5) : sortedData;

  const renderChangeCell = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center gap-1 font-semibold ${
        isPositive ? 'text-agri-success' : 'text-agri-danger'
      }`}>
        {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span>{Math.abs(change).toFixed(2)}%</span>
      </div>
    );
  };

  return (
    <div className={compact ? 'space-y-2' : 'card'}>
      {!compact && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mandi Prices
        </h3>
      )}
      <div className={compact ? 'card' : ''}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:text-agri-primary"
                  onClick={() => handleSort('market')}
                >
                  Market {sortField === 'market' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:text-agri-primary"
                  onClick={() => handleSort('commodity')}
                >
                  Commodity {sortField === 'commodity' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-right font-semibold text-gray-700 cursor-pointer hover:text-agri-primary"
                  onClick={() => handleSort('price')}
                >
                  Price {sortField === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-right font-semibold text-gray-700 cursor-pointer hover:text-agri-primary"
                  onClick={() => handleSort('price_change')}
                >
                  Change {sortField === 'price_change' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-4 py-3 text-right font-semibold text-gray-700 cursor-pointer hover:text-agri-primary"
                  onClick={() => handleSort('volume')}
                >
                  Volume {sortField === 'volume' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900">{item.market}</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-accent">{item.commodity}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {renderChangeCell(item.price_change)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {item.volume.toLocaleString()} units
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit',
                    })}
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
