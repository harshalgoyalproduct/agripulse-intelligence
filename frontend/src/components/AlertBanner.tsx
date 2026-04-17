'use client';

import { Alert } from '../lib/api';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';

interface AlertBannerProps {
  alerts: Alert[];
  onClose?: (id: string) => void;
}

const getSeverityConfig = (type: string) => {
  switch (type) {
    case 'critical':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: AlertTriangle,
        textSecondary: 'text-red-700',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: AlertCircle,
        textSecondary: 'text-yellow-700',
      };
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: Info,
        textSecondary: 'text-blue-700',
      };
  }
};

export function AlertBanner({ alerts, onClose }: AlertBannerProps) {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    new Set(alerts.map((a) => a.id))
  );

  const handleClose = (id: string) => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    onClose?.(id);
  };

  const visibleAlerts = alerts.filter((a) => visibleIds.has(a.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert) => {
        const config = getSeverityConfig(alert.type);
        const IconComponent = config.icon;

        return (
          <div
            key={alert.id}
            className={`${config.bg} ${config.border} border rounded-lg p-4 flex items-start gap-3`}
          >
            <IconComponent size={20} className={config.text} />
            <div className="flex-1">
              <h4 className={`font-semibold ${config.text}`}>{alert.title}</h4>
              <p className={`text-sm ${config.textSecondary} mt-1`}>
                {alert.description}
              </p>
              {alert.district && (
                <p className={`text-xs ${config.textSecondary} mt-2`}>
                  District: {alert.district}
                </p>
              )}
              <p className={`text-xs ${config.textSecondary} mt-1`}>
                {new Date(alert.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <button
              onClick={() => handleClose(alert.id)}
              className={`${config.textSecondary} hover:${config.text} transition-colors p-1`}
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
