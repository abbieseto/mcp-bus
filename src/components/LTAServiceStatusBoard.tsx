import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  Wrench,
  Compass,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { LTAServiceAlert } from '../types/lta';
import { sound } from '../utils/audio';

interface LTAServiceStatusBoardProps {
  busStopCode: string;
  availableServices: string[];
}

export const LTAServiceStatusBoard: React.FC<LTAServiceStatusBoardProps> = ({
  busStopCode,
  availableServices,
}) => {
  const [alerts, setAlerts] = useState<LTAServiceAlert[]>([]);
  const [overallStatus, setOverallStatus] = useState<'normal' | 'advisory' | 'disrupted'>('normal');
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [simulatedAlertActive, setSimulatedAlertActive] = useState<boolean>(false);

  const fetchServiceAlerts = useCallback(async (manual = false) => {
    if (manual) {
      sound.playBubblePop();
      setLoading(true);
    }

    try {
      const res = await fetch(`/api/service-alerts?BusStopCode=${encodeURIComponent(busStopCode)}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
        setOverallStatus(data.overallStatus || 'normal');
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  }, [busStopCode]);

  useEffect(() => {
    fetchServiceAlerts();
  }, [fetchServiceAlerts]);

  // Combined active alerts (API alerts + optional simulated test alert)
  const activeAlerts: LTAServiceAlert[] = [
    ...(simulatedAlertActive
      ? [
          {
            id: 'sim-alert-active',
            category: 'diversion' as const,
            severity: 'warning' as const,
            title: `Temporary Bus Lane Maintenance & Berthing Shift at Stop ${busStopCode}`,
            description: `Road surface resurfacing and smart shelter sensor upgrading in progress.`,
            affectedServices: availableServices.slice(0, 2),
            affectedBusStops: [busStopCode],
            startTime: 'Today, 10:00 AM',
            estimatedEndTime: 'Today, 04:00 PM',
            advice: 'Boarding shifted 15 meters forward to marked temporary bay. Expect ~3 min delay.',
            source: 'LTA Ground Operations (Simulated Test Alert)',
          },
        ]
      : []),
    ...alerts,
  ];

  const currentStatus = activeAlerts.length > 0
    ? activeAlerts.some((a) => a.severity === 'critical')
      ? 'disrupted'
      : 'advisory'
    : 'normal';

  const getCategoryBadge = (category: LTAServiceAlert['category']) => {
    switch (category) {
      case 'diversion':
        return { label: 'Route Diversion', icon: <Compass className="w-3.5 h-3.5" />, color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'maintenance':
        return { label: 'Facility Maintenance', icon: <Wrench className="w-3.5 h-3.5" />, color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'delay':
        return { label: 'Traffic Delay', icon: <Clock className="w-3.5 h-3.5" />, color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'advisory':
      default:
        return { label: 'Service Advisory', icon: <Info className="w-3.5 h-3.5" />, color: 'bg-purple-100 text-purple-900 border-purple-300' };
    }
  };

  return (
    <div
      className={`rounded-[28px] border transition-all mb-6 ${
        currentStatus === 'disrupted'
          ? 'bg-gradient-to-r from-rose-50 via-white to-rose-50 border-rose-300 shadow-sm'
          : currentStatus === 'advisory'
          ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-200 shadow-sm'
          : 'bg-gradient-to-r from-[#e6f8ff]/70 via-white to-[#ffd8e9]/30 border-[#00baff]/30 shadow-xs'
      }`}
    >
      {/* Top Banner Row */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Status Indicator Icon */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
              currentStatus === 'disrupted'
                ? 'bg-rose-500 text-white animate-pulse'
                : currentStatus === 'advisory'
                ? 'bg-amber-400 text-amber-950'
                : 'bg-[#00c49f] text-white'
            }`}
          >
            {currentStatus === 'disrupted' ? (
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            ) : currentStatus === 'advisory' ? (
              <Info className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading font-bold text-sm sm:text-base text-[#171c1f]">
                LTA Service Status Board
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-heading font-extrabold uppercase border ${
                  currentStatus === 'disrupted'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : currentStatus === 'advisory'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {currentStatus === 'disrupted'
                  ? 'Disruption Alert 🚨'
                  : currentStatus === 'advisory'
                  ? `${activeAlerts.length} Active Advisory ⚠️`
                  : 'Normal Operations ✨'}
              </span>
            </div>

            <div className="text-xs text-[#6d7881] mt-0.5 flex items-center gap-2">
              <span>Monitored Stop: <strong className="text-[#004764]">{busStopCode}</strong></span>
              <span>·</span>
              <span>Checked: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Simulation toggle button */}
          <button
            onClick={() => {
              sound.playBubblePop();
              setSimulatedAlertActive(!simulatedAlertActive);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-heading font-bold border transition-colors cursor-pointer ${
              simulatedAlertActive
                ? 'bg-[#ffd8e9] text-[#7a3f60] border-[#fdb0d7]'
                : 'bg-white text-[#6d7881] border-[#dfe3e7] hover:border-[#bdc8d2]'
            }`}
            title="Toggle simulated maintenance alert to test UI"
          >
            {simulatedAlertActive ? 'Disable Test 🧪' : 'Simulate Alert 🧪'}
          </button>

          {/* Refresh button */}
          <button
            onClick={() => fetchServiceAlerts(true)}
            disabled={loading}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#f0f4f8] text-[#00658d] border border-[#bdc8d2]/60 flex items-center justify-center cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
            title="Refresh Service Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => {
              sound.playBubblePop();
              setIsExpanded(!isExpanded);
            }}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#f0f4f8] text-[#3d4850] border border-[#bdc8d2]/60 flex items-center justify-center cursor-pointer transition-colors shadow-xs"
            title={isExpanded ? 'Collapse Status Details' : 'Expand Status Details'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 space-y-3 border-t border-[#dfe3e7]/60">
          {/* Per-Service Operational Health Chips */}
          <div>
            <div className="text-[11px] font-heading font-bold text-[#6d7881] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00baff]" />
              <span>Service Health for Stop {busStopCode}:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableServices.length > 0 ? (
                availableServices.map((svc) => {
                  const hasAlertForService = activeAlerts.some((a) =>
                    a.affectedServices.includes(svc)
                  );
                  return (
                    <div
                      key={svc}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold flex items-center gap-1.5 border shadow-2xs ${
                        hasAlertForService
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-white text-[#004764] border-emerald-200'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>Bus {svc}</span>
                      <span className="text-[10px] font-normal text-[#6d7881]">
                        {hasAlertForService ? 'Advisory' : 'Smooth'}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-[#6d7881] italic">
                  No active bus service filters selected.
                </div>
              )}
            </div>
          </div>

          {/* Active Advisories List */}
          {activeAlerts.length > 0 ? (
            <div className="space-y-2.5 pt-2">
              <div className="text-[11px] font-heading font-bold text-[#884a6c] uppercase tracking-wider">
                Active Maintenance & Travel Notices:
              </div>

              {activeAlerts.map((alert) => {
                const badge = getCategoryBadge(alert.category);

                return (
                  <div
                    key={alert.id}
                    className="p-4 rounded-[22px] bg-white border border-[#bdc8d2]/50 shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold flex items-center gap-1 border ${badge.color}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                        <h4 className="font-heading font-bold text-sm text-[#171c1f]">
                          {alert.title}
                        </h4>
                      </div>

                      <span className="text-[11px] text-[#6d7881] font-mono">
                        {alert.startTime} {alert.estimatedEndTime ? `— ${alert.estimatedEndTime}` : ''}
                      </span>
                    </div>

                    <p className="text-[#3d4850] leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-[#f0f4f8] text-[#004764] font-medium flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-[#00baff] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-heading">Commuter Action:</strong> {alert.advice}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#6d7881] pt-1">
                      <div className="flex items-center gap-1.5">
                        <span>Affected Lines:</span>
                        {alert.affectedServices.map((svc) => (
                          <span
                            key={svc}
                            className="px-1.5 py-0.2 rounded-md bg-white border border-[#bdc8d2] font-mono font-bold text-[#00658d]"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>

                      <span className="italic">{alert.source}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3.5 rounded-[20px] bg-white/80 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All scheduled routes and bus lanes around Stop <strong>{busStopCode}</strong> are currently running with zero reported incidents or roadworks. Enjoy your journey!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
