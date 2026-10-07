import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Layers, Compass } from 'lucide-react';
import { STATIONS, TRANSIT_LINES, INITIAL_VEHICLES } from '../data/transitData';
import { Station, MovingVehicle } from '../types/transit';
import { sound } from '../utils/audio';

interface InteractiveMapScreenProps {
  onStationSelect: (stationId: string) => void;
  selectedStationId?: string | null;
}

export const InteractiveMapScreen: React.FC<InteractiveMapScreenProps> = ({
  onStationSelect,
  selectedStationId,
}) => {
  const [activeLineFilter, setActiveLineFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [vehicles, setVehicles] = useState<MovingVehicle[]>(INITIAL_VEHICLES);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);

  // Smooth live vehicle movement animation
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          let nextProgress = v.progress + 0.04;
          if (nextProgress > 1) {
            nextProgress = 0.05;
          }
          return {
            ...v,
            progress: nextProgress,
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleZoom = (delta: number) => {
    sound.playBubblePop();
    setZoomLevel((prev) => Math.min(1.8, Math.max(0.8, prev + delta)));
  };

  const handleResetZoom = () => {
    sound.playBubblePop();
    setZoomLevel(1);
  };

  const handleLineFilter = (lineId: string) => {
    sound.playBubblePop();
    setActiveLineFilter(lineId);
  };

  const handleStationClick = (station: Station) => {
    sound.playSparkleChime();
    onStationSelect(station.id);
  };

  const activeStation = selectedStationId ? STATIONS[selectedStationId] : null;

  // Track path coordinates across Singapore map
  const tracks = [
    {
      id: 'sky-dtl',
      color: '#00baff',
      strokeWidth: 8,
      d: 'M 24 28 L 58 44 L 74 62 L 48 64',
      name: 'Sky Blue Downtown Line (DTL)',
    },
    {
      id: 'candy-ccl',
      color: '#fdb0d7',
      strokeWidth: 7,
      d: 'M 38 38 L 24 28 L 58 44 L 90 26',
      name: 'Candy Pink Circle Line (CCL)',
    },
    {
      id: 'violet-nel',
      color: '#7d5fff',
      strokeWidth: 7,
      d: 'M 30 72 L 48 64 L 42 54',
      name: 'Magical Violet North-East Line (NEL)',
    },
    {
      id: 'fluffy-bus',
      color: '#00c49f',
      strokeWidth: 6,
      strokeDasharray: '6 4',
      d: 'M 46 16 L 38 38 L 42 54 L 48 64',
      name: 'Pandan Green Bus #190',
    },
    {
      id: 'marina-ferry',
      color: '#38bdf8',
      strokeWidth: 6,
      strokeDasharray: '8 4',
      d: 'M 42 54 L 74 62 L 28 84',
      name: 'Singapore River Cruise & Ferry',
    },
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Top Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 candy-card p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#c6e7ff] text-[#00658d] flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-bold text-[#171c1f]">
              Singapore Chibi MRT & Bus Map
            </h2>
            <p className="text-xs text-[#6d7881]">
              Real-time interactive network diagram with live moving trains & double-decker buses
            </p>
          </div>
        </div>

        {/* Line Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleLineFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
              activeLineFilter === 'all'
                ? 'bg-[#00658d] text-white shadow-xs'
                : 'bg-[#f0f4f8] text-[#3d4850] hover:bg-[#e4e9ed]'
            }`}
          >
            All Lines
          </button>
          {Object.values(TRANSIT_LINES).map((line) => (
            <button
              key={line.id}
              onClick={() => handleLineFilter(line.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeLineFilter === line.id
                  ? 'ring-2 ring-offset-1 text-white shadow-xs'
                  : 'bg-white text-[#3d4850] border border-[#dfe3e7] hover:border-[#00baff]'
              }`}
              style={{
                backgroundColor: activeLineFilter === line.id ? line.color : 'white',
                color: activeLineFilter === line.id ? (line.id === 'candy-ccl' ? '#7a3f60' : 'white') : '#3d4850',
                borderColor: line.color,
              }}
            >
              <span>{line.icon}</span>
              <span className="hidden sm:inline">{line.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas Card */}
      <div className="candy-card relative overflow-hidden bg-gradient-to-br from-[#f6fafe] via-[#ffffff] to-[#f0f4f8] border-2 border-[#bdc8d2]/30 shadow-marshmallow-blue min-h-[520px] sm:min-h-[580px] p-2 sm:p-4 select-none">
        {/* Floating Zoom & Reset Toolbar */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-marshmallow-soft border border-[#bdc8d2]/40">
          <button
            onClick={() => handleZoom(0.2)}
            title="Zoom In"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#00658d] hover:bg-[#c6e7ff] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            title="Zoom Out"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#00658d] hover:bg-[#c6e7ff] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Map"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#00658d] hover:bg-[#c6e7ff] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Overlay at Bottom-Left */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-[24px] shadow-marshmallow-soft border border-[#dfe3e7] text-xs space-y-1.5 hidden sm:block max-w-xs">
          <div className="font-heading font-bold text-[#00658d] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#00baff]" />
            <span>Singapore MRT Legend</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[#3d4850]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-[#00baff]" />
              <span>Downtown (DTL)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-[#fdb0d7]" />
              <span>Circle / Changi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-[#7d5fff]" />
              <span>North-East (NEL)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-[#00c49f]" />
              <span>Double-Decker #190</span>
            </div>
          </div>
        </div>

        {/* Interactive SVG Diagram Viewport */}
        <div
          className="w-full h-full min-h-[500px] flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full max-h-[560px] aspect-square overflow-visible"
          >
            {/* Background Cute Grid Dots */}
            <defs>
              <pattern id="chibi-sg-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.6" fill="#bdc8d2" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#chibi-sg-grid)" />

            {/* Singapore Marina Bay & Strait Water Body */}
            <path
              d="M 15 100 Q 25 88 40 85 T 65 72 T 85 55 T 100 50 L 100 100 Z"
              fill="#c6e7ff"
              opacity="0.35"
            />
            {/* Sentosa Island Shape */}
            <ellipse cx="28" cy="88" rx="8" ry="4" fill="#ffd8e9" opacity="0.45" />
            <text x="28" y="89" fill="#884a6c" fontSize="2.2" fontStyle="italic" textAnchor="middle" opacity="0.8">
              Sentosa 🏝️
            </text>

            <text x="75" y="82" fill="#00658d" fontSize="2.4" fontStyle="italic" opacity="0.6">
              Marina Bay 🌊
            </text>
            <text x="86" y="18" fill="#884a6c" fontSize="2.2" fontStyle="italic" opacity="0.7">
              Changi Coast ✈️
            </text>

            {/* Railway Tracks (Soft Noodles) */}
            {tracks.map((track) => {
              const isDimmed = activeLineFilter !== 'all' && activeLineFilter !== track.id;
              return (
                <g key={track.id} opacity={isDimmed ? 0.2 : 1} className="transition-opacity">
                  {/* Outer glow soft stroke */}
                  <path
                    d={track.d}
                    fill="none"
                    stroke={track.color}
                    strokeWidth={track.strokeWidth + 4}
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Main tube noodle track */}
                  <path
                    d={track.d}
                    fill="none"
                    stroke={track.color}
                    strokeWidth={track.strokeWidth}
                    strokeDasharray={track.strokeDasharray}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}

            {/* Moving Vehicles along the lines */}
            {vehicles.map((v) => {
              const fromStation = STATIONS[v.fromStationId];
              const toStation = STATIONS[v.toStationId];
              if (!fromStation || !toStation) return null;

              // Linear interpolation between stations
              const currentX = fromStation.x + (toStation.x - fromStation.x) * v.progress;
              const currentY = fromStation.y + (toStation.y - fromStation.y) * v.progress;

              const isDimmed = activeLineFilter !== 'all' && activeLineFilter !== v.lineId;
              if (isDimmed) return null;

              return (
                <g key={v.id} transform={`translate(${currentX}, ${currentY})`}>
                  {/* Vehicle pulsing aura */}
                  <circle r="3.2" fill={v.color} opacity="0.3" className="animate-ping" />
                  <circle r="2.2" fill="white" stroke={v.color} strokeWidth="0.8" />
                  <text
                    x="0"
                    y="0.8"
                    fontSize="1.8"
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {v.mode === 'bus' ? '🚌' : v.mode === 'tram' ? '🚋' : '🚆'}
                  </text>
                </g>
              );
            })}

            {/* Stations nodes */}
            {Object.values(STATIONS).map((st) => {
              const isSelected = selectedStationId === st.id;
              const isHovered = hoveredStation?.id === st.id;
              const matchesFilter =
                activeLineFilter === 'all' || st.lineIds.includes(activeLineFilter);

              return (
                <g
                  key={st.id}
                  transform={`translate(${st.x}, ${st.y})`}
                  className="cursor-pointer group"
                  onClick={() => handleStationClick(st)}
                  onMouseEnter={() => setHoveredStation(st)}
                  onMouseLeave={() => setHoveredStation(null)}
                  opacity={matchesFilter ? 1 : 0.3}
                >
                  {/* Outer selection ring */}
                  {(isSelected || isHovered) && (
                    <circle
                      r="4.5"
                      fill="none"
                      stroke="#00baff"
                      strokeWidth="0.8"
                      strokeDasharray="1.5 1"
                      className="animate-spin"
                    />
                  )}

                  {/* Station bubble */}
                  <circle
                    r="2.8"
                    fill={isSelected ? '#00baff' : '#ffffff'}
                    stroke={isSelected ? '#ffffff' : '#00658d'}
                    strokeWidth="1.2"
                    className="transition-transform group-hover:scale-125"
                  />
                  <circle
                    r="1.2"
                    fill={isSelected ? '#ffffff' : '#00baff'}
                  />

                  {/* Station Name Labels */}
                  <text
                    x="0"
                    y="5.8"
                    textAnchor="middle"
                    fontSize="2.4"
                    fontFamily="Quicksand, sans-serif"
                    fontWeight="bold"
                    fill="#171c1f"
                    className="select-none pointer-events-none filter drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
                  >
                    {st.name}
                  </text>
                  {st.japaneseName && (
                    <text
                      x="0"
                      y="8"
                      textAnchor="middle"
                      fontSize="1.8"
                      fontFamily="Nunito Sans, sans-serif"
                      fill="#6d7881"
                      className="select-none pointer-events-none"
                    >
                      {st.japaneseName}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Station Bottom Peek Sheet / Card */}
      {activeStation && (
        <div className="candy-card p-6 bg-gradient-to-r from-white via-[#f0f4f8] to-white border-2 border-[#00baff] shadow-marshmallow-blue animate-float">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00c49f]" />
                <span className="text-xs font-heading font-bold text-[#00658d] uppercase tracking-wider">
                  Singapore Station Spotlight
                </span>
                <span className="text-xs text-[#6d7881]">· {activeStation.vibe}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-[#004764]">
                {activeStation.name} {activeStation.japaneseName ? `(${activeStation.japaneseName})` : ''}
              </h3>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#3d4850]">
                <span className="font-semibold">Kawaii Local Treats:</span>
                {activeStation.amenities.map((am) => (
                  <span key={am} className="px-2.5 py-0.5 rounded-full bg-white border border-[#bdc8d2]/50 text-[#00658d]">
                    {am}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-[#6d7881]">SG Stamp Rally:</div>
                <div className="text-sm font-heading font-bold text-[#7a3f60] flex items-center gap-1 justify-end">
                  <span>{activeStation.stamp.icon}</span>
                  <span>{activeStation.stamp.title}</span>
                </div>
              </div>
              <button
                onClick={() => handleStationClick(activeStation)}
                className="candy-btn-blue text-xs font-heading font-bold px-4 py-2.5 rounded-full cursor-pointer whitespace-nowrap"
              >
                Inspect Station Hub ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
