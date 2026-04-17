'use client';

import { useAlerts } from '../../hooks/useDashboard';
import { AlertBanner } from '../../components/AlertBanner';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function AlertsPage() {
  const { data: alerts = [] } = useAlerts();

  const criticalAlerts = alerts.filter((a) => a.type === 'critical');
  const warningAlerts = alerts.filter((a) => a.type === 'warning');
  const infoAlerts = alerts.filter((a) => a.type === 'info');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Pest Intelligence & Alerts
        </h1>
        <p className="text-gray-600 mt-2">
          Real-time pest pressure warnings and disease risk assessments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Critical Alerts
              </p>
              <p className="text-3xl font-bold text-red-600">
                {criticalAlerts.length}
              </p>
            </div>
            <AlertTriangle size={32} className="text-red-600" />
          </div>
        </div>

        <div className="card border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Warnings
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {warningAlerts.length}
              </p>
            </div>
            <AlertCircle size={32} className="text-yellow-600" />
          </div>
        </div>

        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Information
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {infoAlerts.length}
              </p>
            </div>
            <Info size={32} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* All Alerts */}
      <div className="space-y-6">
        {alerts.length > 0 ? (
          <>
            {criticalAlerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Critical Alerts
                </h3>
                <AlertBanner alerts={criticalAlerts} />
              </div>
            )}

            {warningAlerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Warnings
                </h3>
                <AlertBanner alerts={warningAlerts} />
              </div>
            )}

            {infoAlerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Information
                </h3>
                <AlertBanner alerts={infoAlerts} />
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No alerts at this time</p>
            <p className="text-gray-500 text-sm mt-2">
              Conditions are favorable across all districts
            </p>
          </div>
        )}
      </div>

      {/* Common Pests & Diseases */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Common Cotton Pests & Diseases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Major Pests</h4>
            <div className="space-y-3">
              {[
                'Bollworm (Helicoverpa)',
                'Whitefly (Bemisia)',
                'Jassid (Leafhopper)',
                'Spider Mites',
              ].map((pest) => (
                <div
                  key={pest}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-agri-primary rounded-full" />
                  <span className="text-gray-700">{pest}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Diseases</h4>
            <div className="space-y-3">
              {[
                'Fusarium Wilt',
                'Leaf Curl Virus',
                'Alternaria Leaf Spot',
                'Root Rot',
              ].map((disease) => (
                <div
                  key={disease}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-agri-danger rounded-full" />
                  <span className="text-gray-700">{disease}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prevention Tips */}
      <div className="card bg-agri-light border-2 border-agri-primary">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Prevention & Management Tips
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>✓ Scout fields regularly for early pest detection</li>
          <li>✓ Use integrated pest management (IPM) strategies</li>
          <li>✓ Apply pesticides at appropriate growth stages</li>
          <li>✓ Maintain adequate soil moisture for disease prevention</li>
          <li>✓ Use certified, disease-free seeds</li>
          <li>✓ Implement proper crop rotation practices</li>
        </ul>
      </div>
    </div>
  );
}
