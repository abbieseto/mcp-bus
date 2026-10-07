import React, { useState, useEffect, useCallback, useId } from 'react';
import {
  Bus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Key,
  Sparkles,
  Heart,
  Bell,
  BellRing,
  X,
  Clock,
  Volume2,
} from 'lucide-react';
import { LTABusArrivalResponse, LTANextBus } from '../types/lta';
import { sound } from '../utils/audio';

interface LTABusTrackerProps {
  initialBusStopCode?: string;
  initialServiceNo?: string;
}

export interface WatchedBusArrival {
  id: string; // e.g. "04121-7-NextBus"
  busStopCode: string;
  serviceNo: string;
  arrivalSlot: 'NextBus' | 'NextBus2' | 'NextBus3';
  slotLabel: string;
  estimatedArrival: string;
  notified: boolean;
  createdAt: number;
}

interface TriggeredAlert {
  id: string;
  serviceNo: string;
  busStopCode: string;
  slotLabel: string;
  estimatedMinutes: number;
  triggeredAt: number;
}

export const LTABusTracker: React.FC<LTABusTrackerProps> = ({
  initialBusStopCode = '04121',
  initialServiceNo = '',
}) => {
  const [busStopCode, setBusStopCode] = useState<string>(initialBusStopCode);
  const [serviceNo, setServiceNo] = useState<string>(initialServiceNo);
  const [customKey, setCustomKey] = useState<string>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('lta_custom_key') || '' : '';
  });
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<LTABusArrivalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(20);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [apiHealth, setApiHealth] = useState<{ status: string; ltaKeyConfigured: boolean } | null>(null);
  const [favoritedStops, setFavoritedStops] = useState<string[]>(['04121', '08057', '01112']);

  // Watched / Favorited specific bus arrivals for 2-minute notification
  const [watchedArrivals, setWatchedArrivals] = useState<WatchedBusArrival[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lta_watched_arrivals');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Active triggered alert banners
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);

  // Sync if initialBusStopCode prop changes
  useEffect(() => {
    if (initialBusStopCode) {
      setBusStopCode(initialBusStopCode);
    }
  }, [initialBusStopCode]);

  useEffect(() => {
    if (initialServiceNo) {
      setServiceNo(initialServiceNo);
    }
  }, [initialServiceNo]);

  // Persist watched arrivals to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lta_watched_arrivals', JSON.stringify(watchedArrivals));
      } catch {
        // Ignore storage errors
      }
    }
  }, [watchedArrivals]);

  // Check health endpoint on mount
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((res) => {
        setApiHealth({
          status: res.status,
          ltaKeyConfigured: res.environment?.ltaAccountKeyConfigured ?? false,
        });
      })
      .catch(() => {
        // Silently ignore if not reachable
      });
  }, []);

  const fetchArrivals = useCallback(async (isManual = false) => {
    if (!busStopCode || busStopCode.trim().length === 0) return;
    if (isManual) {
      sound.playBubblePop();
      setLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('BusStopCode', busStopCode.trim());
      if (serviceNo.trim()) {
        params.set('ServiceNo', serviceNo.trim());
      }
      if (customKey.trim()) {
        params.set('AccountKey', customKey.trim());
      }

      const headers: Record<string, string> = {};
      if (customKey.trim()) {
        headers['AccountKey'] = customKey.trim();
      }

      const res = await fetch(`/api/bus-arrival?${params.toString()}`, { headers });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const json: LTABusArrivalResponse = await res.json();
      setData(json);
      setCountdown(20);

      // Update timestamps of watched arrivals matching current stop & services
      if (json.Services) {
        setWatchedArrivals((prev) =>
          prev.map((item) => {
            if (item.busStopCode === json.BusStopCode) {
              const matchedService = json.Services.find((s) => s.ServiceNo === item.serviceNo);
              if (matchedService) {
                const targetBus = matchedService[item.arrivalSlot];
                if (targetBus?.EstimatedArrival) {
                  return {
                    ...item,
                    estimatedArrival: targetBus.EstimatedArrival,
                  };
                }
              }
            }
            return item;
          })
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bus arrival times';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [busStopCode, serviceNo, customKey]);

  // Initial fetch when busStopCode changes
  useEffect(() => {
    fetchArrivals();
  }, [fetchArrivals]);

  // 20-second countdown ticker for auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchArrivals();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, fetchArrivals]);

  // Monitor watched arrivals every second for the 2-minute alert threshold
  useEffect(() => {
    const checker = setInterval(() => {
      const now = Date.now();

      setWatchedArrivals((prev) => {
        let hasChanges = false;

        const updated = prev.map((item) => {
          if (!item.estimatedArrival) return item;

          const arrivalTime = new Date(item.estimatedArrival).getTime();
          const diffMs = arrivalTime - now;
          const diffMinutes = Math.round(diffMs / 60000);

          // Alert condition: Bus is 2 minutes away (<= 2 min and > -1 min) and hasn't notified yet
          if (diffMinutes <= 2 && diffMinutes >= 0 && !item.notified) {
            hasChanges = true;

            // 1. Play cute 3-note melodic alert chime
            sound.playBusArrivalAlert();

            // 2. Trigger browser vibration if supported
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
              try {
                navigator.vibrate([250, 100, 250]);
              } catch {
                // Ignore
              }
            }

            // 3. Trigger native browser Notification if permitted
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(`Bus ${item.serviceNo} is 2 Minutes Away! 🚍✨`, {
                  body: `Your bus is arriving at Stop ${item.busStopCode}. Get ready to board!`,
                  icon: '/favicon.ico',
                });
              } catch {
                // Ignore
              }
            }

            // 4. Add to in-app triggered alert banners
            setTriggeredAlerts((cur) => [
              {
                id: `${item.id}-${now}`,
                serviceNo: item.serviceNo,
                busStopCode: item.busStopCode,
                slotLabel: item.slotLabel,
                estimatedMinutes: Math.max(0, diffMinutes),
                triggeredAt: now,
              },
              ...cur,
            ]);

            return { ...item, notified: true };
          }

          return item;
        });

        // Filter out expired alerts that are more than 5 minutes past arrival
        const valid = updated.filter((item) => {
          const arrivalTime = new Date(item.estimatedArrival).getTime();
          return arrivalTime > now - 5 * 60000;
        });

        return hasChanges || valid.length !== prev.length ? valid : prev;
      });
    }, 1000);

    return () => clearInterval(checker);
  }, []);

  // Toggle favorite / alert on a specific bus arrival
  const handleToggleWatch = (
    targetBusStop: string,
    svcNo: string,
    slot: 'NextBus' | 'NextBus2' | 'NextBus3',
    slotLabel: string,
    estimatedArrival?: string
  ) => {
    if (!estimatedArrival) return;

    const watchId = `${targetBusStop}-${svcNo}-${slot}`;
    const exists = watchedArrivals.some((w) => w.id === watchId);

    if (exists) {
      sound.playBubblePop();
      setWatchedArrivals((prev) => prev.filter((w) => w.id !== watchId));
    } else {
      sound.playSparkleChime();

      // Request browser notification permission if not yet decided
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }

      const newWatch: WatchedBusArrival = {
        id: watchId,
        busStopCode: targetBusStop,
        serviceNo: svcNo,
        arrivalSlot: slot,
        slotLabel,
        estimatedArrival,
        notified: false,
        createdAt: Date.now(),
      };

      setWatchedArrivals((prev) => [newWatch, ...prev]);
    }
  };

  const handleDismissTriggeredAlert = (alertId: string) => {
    sound.playBubblePop();
    setTriggeredAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleSaveCustomKey = (key: string) => {
    setCustomKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lta_custom_key', key);
    }
  };

  const toggleFavorite = (code: string) => {
    sound.playBubblePop();
    setFavoritedStops((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Format estimated minutes until arrival
  const getMinutesUntil = (estimatedArrival?: string): string => {
    if (!estimatedArrival) return 'N/A';
    const arrival = new Date(estimatedArrival);
    const now = new Date();
    const diffMs = arrival.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins <= 0) return 'Arr';
    if (diffMins === 1) return '1 min';
    return `${diffMins} min`;
  };

  const getLoadBadge = (load?: string) => {
    switch (load) {
      case 'SEA':
        return { label: 'Seats Avail 🟢', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'SDA':
        return { label: 'Standing 🟡', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'LSD':
        return { label: 'Limited 🔴', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: 'Normal', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'DD':
        return '🚍 Double Deck';
      case 'BD':
        return '🚎 Bendy';
      default:
        return '🚌 Single Deck';
    }
  };

  const presetStops = [
    { code: '04121', name: 'Old Parliament House (Supreme Ct)' },
    { code: '08057', name: 'Orchard Plaza (Somerset)' },
    { code: '09022', name: 'Orchard Stn / Lucky Plaza' },
    { code: '01112', name: 'Bugis Junction' },
    { code: '05019', name: 'Chinatown Stn Exit C' },
    { code: '03222', name: 'Clarke Quay Stn' },
    { code: '14141', name: 'HarbourFront / VivoCity' },
    { code: '41021', name: 'Botanic Gdns Stn' },
    { code: '52009', name: 'Toa Payoh Bus Interchange' },
    { code: '95019', name: 'Changi Airport PTB2' },
  ];

  const isLiveConnected = data?.source === 'lta-datamall-live' || apiHealth?.ltaKeyConfigured;

  return (
    <div className="candy-card p-6 sm:p-8 border-2 border-[#00baff]/30 shadow-marshmallow-blue bg-white relative">
      {/* 2-MINUTE ARRIVAL TRIGGERED TOAST ALERT BANNER */}
      {triggeredAlerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {triggeredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-5 rounded-[28px] bg-gradient-to-r from-[#ffd8e9] via-white to-[#c6e7ff] border-2 border-[#fdb0d7] shadow-marshmallow-pink flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#fdb0d7] text-[#7a3f60] flex items-center justify-center shadow-md animate-pulse">
                  <BellRing className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-[#884a6c] text-[11px] font-heading font-extrabold uppercase border border-[#fdb0d7]">
                      🔔 Bus 2-Min Alert!
                    </span>
                    <span className="text-xs font-semibold text-[#00658d]">
                      Stop {alert.busStopCode}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-[#171c1f] mt-0.5">
                    Bus {alert.serviceNo} ({alert.slotLabel}) is arriving in ≤ 2 minutes! 🚍💨
                  </h3>
                  <p className="text-xs text-[#3d4850]">
                    Please head toward the boarding berth now. Have your SimplyGo CandyPass ready!
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDismissTriggeredAlert(alert.id)}
                className="candy-btn-pink px-5 py-2.5 rounded-full font-heading font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>Heading Out! 🏃‍♀️</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveConnected ? 'bg-[#00c49f] animate-ping' : 'bg-[#00baff]'
              }`}
            />
            <span className="text-xs font-heading font-bold text-[#00658d] uppercase tracking-wider">
              {isLiveConnected
                ? 'LTA DataMall v3 Live Connected 🟢'
                : 'LTA DataMall Integration Ready ✨'}
            </span>
            <span className="text-xs text-[#6d7881]">· Singapore Land Transport Authority</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#004764] flex items-center gap-2">
            <span>Singapore Live Bus Arrival Radar</span>
            <Bus className="w-5 h-5 text-[#00baff]" />
          </h2>
          <p className="text-xs sm:text-sm text-[#3d4850]">
            Tap any <Bell className="w-3.5 h-3.5 inline text-[#884a6c]" /> icon on an arrival time to set a friendly alert when the bus is 2 minutes away!
          </p>
        </div>

        {/* API Health & Auto-refresh status */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {isLiveConnected ? (
            <div className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-[#c6e7ff] text-[#004764] border border-[#00baff] flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00baff]" />
              <span>Live Stream Active</span>
            </div>
          ) : (
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-[#ffd8e9] hover:bg-[#fdb0d7] text-[#7a3f60] border border-[#fdb0d7] flex items-center gap-1 transition-colors cursor-pointer"
              title="Configure or test AccountKey"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Test Key</span>
            </button>
          )}

          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-[#f0f4f8] hover:bg-[#e4e9ed] text-[#00658d] border border-[#bdc8d2] flex items-center gap-1 transition-colors cursor-pointer"
            title="Open /api/health endpoint"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00c49f]" />
            <span>Health</span>
            <ExternalLink className="w-3 h-3 text-[#6d7881]" />
          </a>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1 rounded-full text-xs font-heading font-bold border transition-all cursor-pointer ${
              autoRefresh
                ? 'bg-[#c6e7ff] text-[#004764] border-[#00baff]'
                : 'bg-white text-[#6d7881] border-[#dfe3e7]'
            }`}
          >
            {autoRefresh ? `Auto: ${countdown}s` : 'Paused'}
          </button>

          <button
            onClick={() => fetchArrivals(true)}
            disabled={loading}
            className="w-8 h-8 rounded-full candy-btn-blue flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ACTIVE WATCHED BUS ARRIVALS LIST */}
      {watchedArrivals.length > 0 && (
        <div className="mb-6 p-4 sm:p-5 rounded-[28px] bg-gradient-to-r from-[#ffd8e9]/40 via-white to-[#c6e7ff]/30 border border-[#fdb0d7] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#884a6c]" />
              <h3 className="text-sm font-heading font-bold text-[#884a6c]">
                Active Bus 2-Min Alerts ({watchedArrivals.length})
              </h3>
            </div>
            <span className="text-[11px] text-[#6d7881]">
              You will be alerted with audio & notification at ≤ 2 min
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {watchedArrivals.map((watch) => {
              const minutes = getMinutesUntil(watch.estimatedArrival);
              return (
                <div
                  key={watch.id}
                  className={`p-3 rounded-2xl bg-white border flex items-center justify-between gap-2 shadow-xs transition-all ${
                    watch.notified
                      ? 'border-[#00c49f] ring-1 ring-[#00c49f]'
                      : 'border-[#fdb0d7]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-[#00658d] text-white flex items-center justify-center font-heading font-bold text-xs">
                      {watch.serviceNo}
                    </span>
                    <div>
                      <div className="text-xs font-heading font-bold text-[#171c1f]">
                        {watch.slotLabel} · Stop {watch.busStopCode}
                      </div>
                      <div className="text-[11px] text-[#00658d] font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>ETA: {minutes}</span>
                        {watch.notified && (
                          <span className="text-[#00c49f] font-bold">· Alerted!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playBubblePop();
                      setWatchedArrivals((prev) => prev.filter((w) => w.id !== watch.id));
                    }}
                    className="w-6 h-6 rounded-full hover:bg-[#f0f4f8] text-[#6d7881] hover:text-[#93000a] flex items-center justify-center cursor-pointer transition-colors"
                    title="Cancel Alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Custom AccountKey Input (for instant in-browser test) */}
      {showKeyInput && (
        <div className="p-4 rounded-[24px] bg-[#ffd8e9]/30 border border-[#fdb0d7] mb-6 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#884a6c] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>LTA AccountKey In-Browser Tester:</span>
            </span>
            <span className="text-[11px] text-[#6d7881]">
              Saved in Vercel? You don't need to enter anything here.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="Paste LTA DataMall AccountKey..."
              value={customKey}
              onChange={(e) => handleSaveCustomKey(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full bg-white text-xs font-mono border border-[#bdc8d2] focus:border-[#00baff] focus:outline-none"
            />
            <button
              onClick={() => {
                fetchArrivals(true);
                setShowKeyInput(false);
              }}
              className="candy-btn-pink px-4 py-2 rounded-full text-xs font-heading font-bold cursor-pointer"
            >
              Apply & Test
            </button>
          </div>
        </div>
      )}

      {/* Search & Parameters Control */}
      <div className="p-4 rounded-[24px] bg-[#f0f4f8] border border-[#dfe3e7] mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-3 items-end">
          {/* BusStopCode Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-heading font-bold text-[#3d4850]">
                Bus Stop Code (5 Digits)
              </label>
              <button
                onClick={() => toggleFavorite(busStopCode)}
                className="text-[11px] font-heading font-bold text-[#884a6c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    favoritedStops.includes(busStopCode) ? 'fill-[#fdb0d7] text-[#884a6c]' : ''
                  }`}
                />
                <span>{favoritedStops.includes(busStopCode) ? 'Saved' : 'Save'}</span>
              </button>
            </div>
            <input
              type="text"
              value={busStopCode}
              onChange={(e) => setBusStopCode(e.target.value)}
              placeholder="e.g. 04121"
              maxLength={5}
              className="w-full px-4 py-2.5 rounded-full bg-white text-sm font-mono font-bold text-[#171c1f] border-2 border-transparent focus:border-[#00baff] focus:outline-none shadow-xs"
            />
          </div>

          {/* ServiceNo Input */}
          <div>
            <label className="block text-xs font-heading font-bold text-[#3d4850] mb-1">
              Service No (Optional filter)
            </label>
            <input
              type="text"
              value={serviceNo}
              onChange={(e) => setServiceNo(e.target.value)}
              placeholder="e.g. 7 (Leave empty for all)"
              className="w-full px-4 py-2.5 rounded-full bg-white text-sm font-mono font-bold text-[#171c1f] border-2 border-transparent focus:border-[#00baff] focus:outline-none shadow-xs"
            />
          </div>

          {/* Apply button */}
          <button
            onClick={() => fetchArrivals(true)}
            className="candy-btn-blue h-10 px-5 rounded-full font-heading font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Query LTA</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-heading font-semibold text-[#6d7881] mr-1">
            Singapore Hubs:
          </span>
          {presetStops.map((preset) => (
            <button
              key={preset.code}
              onClick={() => {
                sound.playBubblePop();
                setBusStopCode(preset.code);
              }}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                busStopCode === preset.code
                  ? 'bg-[#c6e7ff] text-[#004764] border-[#00baff] font-bold'
                  : 'bg-white text-[#3d4850] border-[#bdc8d2]/60 hover:border-[#00baff]'
              }`}
            >
              <span className="font-mono">{preset.code}</span> · {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live Data Note / Source Indicator */}
      {data?.source === 'lta-datamall-live' && (
        <div className="mb-4 p-3 rounded-[20px] bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Live LTA DataMall v3 Stream Active: Showing official real-time bus arrivals for Singapore.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-[20px] bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bus Services Grid */}
      <div className="space-y-3">
        {loading && !data && (
          <div className="py-12 text-center text-xs font-heading font-bold text-[#00658d] animate-pulse">
            Connecting to Singapore LTA DataMall v3 Bus Arrival Feed...
          </div>
        )}

        {data && data.Services && data.Services.length === 0 && (
          <div className="py-8 text-center text-xs text-[#6d7881] font-heading font-semibold">
            No active bus arrivals found for Stop {busStopCode} at this moment.
          </div>
        )}

        {data && data.Services && data.Services.map((service) => {
          const loadBadge = getLoadBadge(service.NextBus?.Load);

          const isNextBusWatched = watchedArrivals.some(
            (w) => w.id === `${data.BusStopCode}-${service.ServiceNo}-NextBus`
          );
          const isNextBus2Watched = watchedArrivals.some(
            (w) => w.id === `${data.BusStopCode}-${service.ServiceNo}-NextBus2`
          );
          const isNextBus3Watched = watchedArrivals.some(
            (w) => w.id === `${data.BusStopCode}-${service.ServiceNo}-NextBus3`
          );

          return (
            <div
              key={service.ServiceNo}
              className="p-4 sm:p-5 rounded-[24px] bg-[#f6fafe] border border-[#bdc8d2]/40 hover:border-[#00baff] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Bus Service Number & Operator */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#00658d] text-white flex flex-col items-center justify-center shadow-md">
                  <span className="font-heading font-extrabold text-xl leading-none">
                    {service.ServiceNo}
                  </span>
                  <span className="text-[10px] text-white/80 uppercase font-mono mt-0.5">
                    {service.Operator}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-bold text-[#171c1f]">
                      {getTypeBadge(service.NextBus?.Type)}
                    </span>
                    {service.NextBus?.Feature === 'WAB' && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-[#00658d] border border-[#bdc8d2]/60" title="Wheelchair Accessible Bus">
                        ♿ WAB
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#6d7881] mt-0.5 flex items-center gap-2">
                    <span>Stop {data.BusStopCode}</span>
                    <span>·</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${loadBadge.color}`}>
                      {loadBadge.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Arrivals Timeline with 2-Minute Alert Bell Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                {/* 1st Arrival */}
                <div
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between min-w-[84px] text-center transition-all ${
                    isNextBusWatched
                      ? 'bg-gradient-to-b from-white to-[#ffd8e9]/40 border-[#fdb0d7] shadow-marshmallow-pink ring-2 ring-[#fdb0d7]'
                      : 'bg-white border-[#00baff]/30 shadow-xs'
                  }`}
                >
                  <div className="text-[10px] font-heading font-bold text-[#00658d] uppercase">
                    Next Bus
                  </div>
                  <div className="text-base font-heading font-extrabold text-[#004764] my-0.5">
                    {getMinutesUntil(service.NextBus?.EstimatedArrival)}
                  </div>
                  <div className="text-[10px] text-[#6d7881] mb-1.5">
                    {service.NextBus?.Type === 'DD' ? 'Double' : 'Single'}
                  </div>

                  <button
                    onClick={() =>
                      handleToggleWatch(
                        data.BusStopCode,
                        service.ServiceNo,
                        'NextBus',
                        'Next Bus',
                        service.NextBus?.EstimatedArrival
                      )
                    }
                    className={`w-full py-1 px-1.5 rounded-full text-[10px] font-heading font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      isNextBusWatched
                        ? 'bg-[#fdb0d7] text-[#7a3f60] shadow-xs'
                        : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#c6e7ff] hover:text-[#004764]'
                    }`}
                    title={isNextBusWatched ? 'Cancel 2-min Alert' : 'Alert me when 2 min away'}
                  >
                    <Bell className={`w-3 h-3 ${isNextBusWatched ? 'fill-current' : ''}`} />
                    <span>{isNextBusWatched ? '≤2m Set' : 'Alert'}</span>
                  </button>
                </div>

                {/* 2nd Arrival */}
                {service.NextBus2?.EstimatedArrival && (
                  <div
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between min-w-[84px] text-center transition-all ${
                      isNextBus2Watched
                        ? 'bg-gradient-to-b from-white to-[#ffd8e9]/40 border-[#fdb0d7] shadow-marshmallow-pink ring-2 ring-[#fdb0d7]'
                        : 'bg-white/80 border-[#dfe3e7]'
                    }`}
                  >
                    <div className="text-[10px] font-heading font-bold text-[#6d7881] uppercase">
                      2nd Bus
                    </div>
                    <div className="text-sm font-heading font-bold text-[#3d4850] my-0.5">
                      {getMinutesUntil(service.NextBus2?.EstimatedArrival)}
                    </div>
                    <div className="text-[10px] text-[#6d7881] mb-1.5">
                      {service.NextBus2?.Type === 'DD' ? 'Double' : 'Single'}
                    </div>

                    <button
                      onClick={() =>
                        handleToggleWatch(
                          data.BusStopCode,
                          service.ServiceNo,
                          'NextBus2',
                          '2nd Bus',
                          service.NextBus2?.EstimatedArrival
                        )
                      }
                      className={`w-full py-1 px-1.5 rounded-full text-[10px] font-heading font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isNextBus2Watched
                          ? 'bg-[#fdb0d7] text-[#7a3f60] shadow-xs'
                          : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#c6e7ff] hover:text-[#004764]'
                      }`}
                      title={isNextBus2Watched ? 'Cancel 2-min Alert' : 'Alert me when 2 min away'}
                    >
                      <Bell className={`w-3 h-3 ${isNextBus2Watched ? 'fill-current' : ''}`} />
                      <span>{isNextBus2Watched ? '≤2m Set' : 'Alert'}</span>
                    </button>
                  </div>
                )}

                {/* 3rd Arrival */}
                {service.NextBus3?.EstimatedArrival && (
                  <div
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between min-w-[84px] text-center transition-all hidden sm:flex ${
                      isNextBus3Watched
                        ? 'bg-gradient-to-b from-white to-[#ffd8e9]/40 border-[#fdb0d7] shadow-marshmallow-pink ring-2 ring-[#fdb0d7]'
                        : 'bg-white/60 border-[#dfe3e7]'
                    }`}
                  >
                    <div className="text-[10px] font-heading font-bold text-[#6d7881] uppercase">
                      3rd Bus
                    </div>
                    <div className="text-sm font-heading font-bold text-[#6d7881] my-0.5">
                      {getMinutesUntil(service.NextBus3?.EstimatedArrival)}
                    </div>
                    <div className="text-[10px] text-[#6d7881] mb-1.5">
                      {service.NextBus3?.Type === 'DD' ? 'Double' : 'Single'}
                    </div>

                    <button
                      onClick={() =>
                        handleToggleWatch(
                          data.BusStopCode,
                          service.ServiceNo,
                          'NextBus3',
                          '3rd Bus',
                          service.NextBus3?.EstimatedArrival
                        )
                      }
                      className={`w-full py-1 px-1.5 rounded-full text-[10px] font-heading font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isNextBus3Watched
                          ? 'bg-[#fdb0d7] text-[#7a3f60] shadow-xs'
                          : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#c6e7ff] hover:text-[#004764]'
                      }`}
                      title={isNextBus3Watched ? 'Cancel 2-min Alert' : 'Alert me when 2 min away'}
                    >
                      <Bell className={`w-3 h-3 ${isNextBus3Watched ? 'fill-current' : ''}`} />
                      <span>{isNextBus3Watched ? '≤2m Set' : 'Alert'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
