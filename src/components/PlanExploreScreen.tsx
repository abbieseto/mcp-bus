import React, { useState } from 'react';
import { ArrowDownUp, MapPin, Clock, ArrowRight, Sparkles, Navigation, Bus, Train, Zap, ShieldCheck } from 'lucide-react';
import { STATIONS, TRANSIT_LINES, getSampleRoutes, INITIAL_VEHICLES } from '../data/transitData';
import { TransitMode, RouteOption } from '../types/transit';
import { sound } from '../utils/audio';
import { ASSETS } from '../assets/images';
import { LTABusTracker } from './LTABusTracker';

interface PlanExploreScreenProps {
  onSelectRouteForLiveTrip: (route: RouteOption) => void;
  onStationClick: (stationId: string) => void;
  onExploreMap: () => void;
}

export const PlanExploreScreen: React.FC<PlanExploreScreenProps> = ({
  onSelectRouteForLiveTrip,
  onStationClick,
  onExploreMap,
}) => {
  const [originId, setOriginId] = useState<string>('botanic-gardens');
  const [destinationId, setDestinationId] = useState<string>('marina-bay');
  const [selectedModeFilter, setSelectedModeFilter] = useState<TransitMode | 'all'>('all');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-fastest');

  const availableStations = Object.values(STATIONS);
  const routeOptions = getSampleRoutes(originId, destinationId);

  const filteredRoutes = routeOptions.filter((r) => {
    if (selectedModeFilter === 'all') return true;
    return r.lines.some((l) => l.mode === selectedModeFilter);
  });

  const handleSwapStations = () => {
    sound.playBubblePop();
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
  };

  const handleModeToggle = (mode: TransitMode | 'all') => {
    sound.playBubblePop();
    setSelectedModeFilter(mode);
  };

  const handleSelectRouteCard = (route: RouteOption) => {
    sound.playBubblePop();
    setSelectedRouteId(route.id);
  };

  const handleStartLive = (route: RouteOption) => {
    sound.playSparkleChime();
    onSelectRouteForLiveTrip(route);
  };

  // Quick preset destinations in Singapore
  const presetPlaces = [
    { id: 'marina-bay', label: 'Marina Bay Sands 🌸' },
    { id: 'orchard', label: 'Orchard Road 🛍️' },
    { id: 'bugis', label: 'Haji Lane & Bugis 🎨' },
    { id: 'changi-airport', label: 'Changi Jewel 💎' },
    { id: 'chinatown', label: 'Chinatown 🥮' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Hero Welcome Card with Chibi Skyline & Mascot */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#c6e7ff] via-[#f0f4f8] to-[#ffd8e9] border border-[#bdc8d2]/30 shadow-marshmallow-blue p-6 sm:p-8">
        {/* Subtle decorative background illustration */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none bg-cover bg-center mix-blend-multiply"
          style={{ backgroundImage: `url(${ASSETS.skylineBanner})` }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#00baff]/30 text-xs font-heading font-bold text-[#00658d] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#00baff]" />
              <span>Singapore MRT & Bus Network · 99.8% On-Time ✨</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold tracking-tight text-[#004764] leading-tight">
              Where are we hopping in Singapore today?
            </h1>
            <p className="text-sm sm:text-base text-[#3d4850] font-normal leading-relaxed">
              Fast, friendly, candy-coated connections across the Lion City. Hop aboard MRT lines & double-decker buses with Merly the Chibi Merlion!
            </p>
          </div>

          {/* Chibi Mascot Avatar with Floating Badge */}
          <div className="shrink-0 relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#00baff] via-white to-[#fdb0d7] shadow-marshmallow-pink animate-float">
              <img
                src={ASSETS.mascotConductor}
                alt="Merly the Singapore Chibi Merlion Conductor"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white border border-[#00baff] rounded-full px-2.5 py-0.5 text-[11px] font-heading font-bold text-[#00658d] shadow-sm">
              Merly 🦁
            </div>
          </div>
        </div>
      </div>

      {/* Main Trip Planner Search Box */}
      <div className="candy-card p-6 sm:p-8 shadow-marshmallow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-heading font-bold text-[#171c1f] flex items-center gap-2">
            <span>Route Finder</span>
            <span className="text-xs font-normal text-[#6d7881] px-2 py-0.5 rounded-full bg-[#f0f4f8]">
              Soft-Hop Navigation
            </span>
          </h2>
          <button
            onClick={onExploreMap}
            className="text-xs font-heading font-bold text-[#00658d] hover:text-[#00baff] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View Network Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Origin & Destination Inputs with Swap */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-3">
          {/* Origin Input */}
          <div className="relative">
            <label className="block text-xs font-heading font-bold text-[#3d4850] mb-1.5 ml-2">
              Hop on at (Origin)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 w-7 h-7 rounded-full bg-[#c6e7ff] text-[#00658d] flex items-center justify-center pointer-events-none">
                <MapPin className="w-4 h-4 text-[#00658d]" />
              </div>
              <select
                value={originId}
                onChange={(e) => {
                  sound.playBubblePop();
                  setOriginId(e.target.value);
                }}
                className="w-full pl-13 pr-8 py-3.5 bg-[#f0f4f8] hover:bg-[#eaeef2] focus:bg-white text-sm font-semibold rounded-full border-2 border-transparent focus:border-[#00baff] focus:outline-none transition-all cursor-pointer shadow-inner"
              >
                {availableStations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} {st.japaneseName ? `(${st.japaneseName})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center pt-2 md:pt-5">
            <button
              onClick={handleSwapStations}
              title="Swap origin and destination"
              className="w-11 h-11 rounded-full bg-[#ffd8e9] hover:bg-[#fdb0d7] text-[#884a6c] flex items-center justify-center transition-transform hover:rotate-180 active:scale-90 shadow-sm cursor-pointer"
            >
              <ArrowDownUp className="w-5 h-5" />
            </button>
          </div>

          {/* Destination Input */}
          <div className="relative">
            <label className="block text-xs font-heading font-bold text-[#3d4850] mb-1.5 ml-2">
              Hop off at (Destination)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 w-7 h-7 rounded-full bg-[#ffd8e9] text-[#884a6c] flex items-center justify-center pointer-events-none">
                <Navigation className="w-4 h-4 text-[#884a6c]" />
              </div>
              <select
                value={destinationId}
                onChange={(e) => {
                  sound.playBubblePop();
                  setDestinationId(e.target.value);
                }}
                className="w-full pl-13 pr-8 py-3.5 bg-[#f0f4f8] hover:bg-[#eaeef2] focus:bg-white text-sm font-semibold rounded-full border-2 border-transparent focus:border-[#00baff] focus:outline-none transition-all cursor-pointer shadow-inner"
              >
                {availableStations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} {st.japaneseName ? `(${st.japaneseName})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Presets Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-heading font-semibold text-[#6d7881] mr-1">
            Quick hops:
          </span>
          {presetPlaces.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                sound.playBubblePop();
                setDestinationId(preset.id);
              }}
              className={`text-xs font-heading font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                destinationId === preset.id
                  ? 'bg-[#c6e7ff] text-[#004764] border-[#00baff] shadow-xs'
                  : 'bg-white text-[#3d4850] border-[#bdc8d2]/60 hover:border-[#00baff] hover:bg-[#f0f4f8]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Transit Mode Chips (Colored circles with white icons, Quicksand Bold labels) */}
        <div className="mt-6 pt-5 border-t border-[#dfe3e7]/80">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-heading font-bold text-[#3d4850] mr-2">
              Preferred Mode:
            </span>

            {/* All chip */}
            <button
              onClick={() => handleModeToggle('all')}
              className={`h-9 px-4 rounded-full flex items-center gap-2 text-xs font-heading font-bold transition-all cursor-pointer ${
                selectedModeFilter === 'all'
                  ? 'bg-[#00658d] text-white shadow-sm'
                  : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#e4e9ed]'
              }`}
            >
              <span>All Modes</span>
            </button>

            {/* Train Chip */}
            <button
              onClick={() => handleModeToggle('train')}
              className={`h-9 px-3.5 rounded-full flex items-center gap-2 text-xs font-heading font-bold transition-all cursor-pointer ${
                selectedModeFilter === 'train'
                  ? 'bg-[#00baff] text-white shadow-marshmallow-blue'
                  : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#e4e9ed]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#00658d] text-white flex items-center justify-center">
                <Train className="w-3 h-3 text-white" />
              </div>
              <span>Metro Train</span>
            </button>

            {/* Tram Chip */}
            <button
              onClick={() => handleModeToggle('tram')}
              className={`h-9 px-3.5 rounded-full flex items-center gap-2 text-xs font-heading font-bold transition-all cursor-pointer ${
                selectedModeFilter === 'tram'
                  ? 'bg-[#fdb0d7] text-[#7a3f60] shadow-marshmallow-pink'
                  : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#e4e9ed]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#884a6c] text-white flex items-center justify-center">
                <span>🚋</span>
              </div>
              <span>Candy Tram</span>
            </button>

            {/* Bus Chip */}
            <button
              onClick={() => handleModeToggle('bus')}
              className={`h-9 px-3.5 rounded-full flex items-center gap-2 text-xs font-heading font-bold transition-all cursor-pointer ${
                selectedModeFilter === 'bus'
                  ? 'bg-[#00c49f] text-white shadow-sm'
                  : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#e4e9ed]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#008b70] text-white flex items-center justify-center">
                <Bus className="w-3 h-3 text-white" />
              </div>
              <span>Cloud Bus</span>
            </button>

            {/* Express Chip */}
            <button
              onClick={() => handleModeToggle('express')}
              className={`h-9 px-3.5 rounded-full flex items-center gap-2 text-xs font-heading font-bold transition-all cursor-pointer ${
                selectedModeFilter === 'express'
                  ? 'bg-[#7d5fff] text-white shadow-sm'
                  : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#e4e9ed]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#420bc4] text-white flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span>Violet Express</span>
            </button>
          </div>
        </div>
      </div>

      {/* Route Selection Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-[#171c1f]">
            Recommended Routes ({filteredRoutes.length})
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-[#6d7881]">
            <ShieldCheck className="w-4 h-4 text-[#00baff]" />
            <span>Real-time GPS Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredRoutes.map((route) => {
            const isSelected = selectedRouteId === route.id;
            const badgeBg =
              route.badge === 'fastest'
                ? 'bg-[#c6e7ff] text-[#004764] border-[#00baff]'
                : route.badge === 'sweetest'
                ? 'bg-[#ffd8e9] text-[#7a3f60] border-[#fdb0d7]'
                : 'bg-[#e4e9ed] text-[#3d4850] border-[#bdc8d2]';

            return (
              <div
                key={route.id}
                onClick={() => handleSelectRouteCard(route)}
                className={`candy-card p-6 cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'ring-3 ring-[#00baff] shadow-marshmallow-blue bg-white'
                    : 'hover:shadow-marshmallow-soft hover:border-[#00baff]/40'
                }`}
              >
                {/* Top Badge: Sparkle or Star */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-heading font-bold border ${badgeBg}`}
                    >
                      <span>{route.badgeEmoji}</span>
                      <span>{route.badgeLabel}</span>
                    </span>

                    <span className="text-xl font-heading font-bold text-[#00658d]">
                      {route.durationMinutes} min
                    </span>
                  </div>

                  {/* Departure & Arrival */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#171c1f] mb-3">
                    <Clock className="w-4 h-4 text-[#6d7881]" />
                    <span>
                      {route.departureTime} → {route.arrivalTime}
                    </span>
                  </div>

                  {/* Lines used in route */}
                  <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                    {route.lines.map((ln, idx) => (
                      <React.Fragment key={ln.id}>
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-heading font-bold flex items-center gap-1"
                          style={{
                            backgroundColor: `${ln.color}25`,
                            color: ln.accentColor,
                            border: `1px solid ${ln.color}`,
                          }}
                        >
                          <span>{ln.icon}</span>
                          <span>{ln.name}</span>
                        </span>
                        {idx < route.lines.length - 1 && (
                          <span className="text-xs text-[#bdc8d2]">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Route Specs (Unboxed metadata with typographic separators) */}
                  <div className="flex items-center gap-2 text-xs text-[#3d4850] mb-5">
                    <span className="font-bold text-[#00658d]">{route.price}</span>
                    <span aria-hidden="true" className="text-[#bdc8d2]">·</span>
                    <span>{route.transfers === 0 ? 'Direct ride' : `${route.transfers} transfer`}</span>
                    <span aria-hidden="true" className="text-[#bdc8d2]">·</span>
                    <span>{route.co2Saved}</span>
                  </div>
                </div>

                {/* Squishy Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartLive(route);
                  }}
                  className={`w-full py-3 px-4 rounded-full font-heading font-bold text-sm flex items-center justify-center gap-2 cursor-pointer ${
                    route.badge === 'sweetest'
                      ? 'candy-btn-pink'
                      : route.badge === 'fastest'
                      ? 'candy-btn-blue'
                      : 'candy-btn-blue'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>Start Live Journey</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Singapore LTA Live Bus Arrival Radar (Direct LTA DataMall Integration) */}
      <LTABusTracker />

      {/* Live Nearby Radar / Station Departures */}
      <div className="candy-card p-6 sm:p-8 bg-gradient-to-r from-white via-[#f0f4f8] to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-heading font-bold text-[#171c1f] flex items-center gap-2">
              <span>Live Departure Radar</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c49f] animate-ping" />
            </h3>
            <p className="text-xs sm:text-sm text-[#6d7881]">
              Real-time transit vehicles moving across the city right now
            </p>
          </div>
          <button
            onClick={onExploreMap}
            className="candy-btn-blue text-xs font-heading font-bold px-4 py-2 rounded-full self-start sm:self-auto cursor-pointer"
          >
            Open Interactive Map 🗺️
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_VEHICLES.map((vehicle) => {
            const line = TRANSIT_LINES[vehicle.lineId];
            return (
              <div
                key={vehicle.id}
                onClick={() => onStationClick(vehicle.toStationId)}
                className="p-4 rounded-[24px] bg-white border border-[#bdc8d2]/40 hover:border-[#00baff] transition-all cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: `${line?.color || '#00baff'}30` }}
                  >
                    <span>{line?.icon || '🚆'}</span>
                  </div>
                  <span className="text-xs font-heading font-bold text-[#00658d] px-2 py-0.5 rounded-full bg-[#c6e7ff]">
                    in {vehicle.etaMinutes} min ✨
                  </span>
                </div>

                <div className="text-sm font-heading font-bold text-[#171c1f] truncate">
                  {vehicle.lineName}
                </div>
                <div className="text-xs text-[#3d4850] mt-0.5 truncate">
                  Next: <span className="font-semibold text-[#004764]">{vehicle.nextStopName}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-[#f0f4f8] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round(vehicle.progress * 100)}%`,
                      backgroundColor: line?.color || '#00baff',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
