import React from 'react';
import { X, Navigation, Award, Sparkles, Clock, Check, Coffee, MapPin } from 'lucide-react';
import { Station, TransitLine } from '../types/transit';
import { TRANSIT_LINES } from '../data/transitData';
import { sound } from '../utils/audio';

interface StationDetailModalProps {
  station: Station | null;
  isOpen: boolean;
  onClose: () => void;
  onPlanTripToStation: (stationId: string) => void;
  isStampUnlocked: boolean;
  onCollectStamp: (stationId: string) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  isOpen,
  onClose,
  onPlanTripToStation,
  isStampUnlocked,
  onCollectStamp,
}) => {
  if (!isOpen || !station) return null;

  const lines = station.lineIds.map((lid) => TRANSIT_LINES[lid]).filter(Boolean);

  const handleClose = () => {
    sound.playBubblePop();
    onClose();
  };

  const handleCollect = () => {
    sound.playSparkleChime();
    onCollectStamp(station.id);
  };

  const handlePlanHop = () => {
    sound.playBubblePop();
    onPlanTripToStation(station.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/40 backdrop-blur-xs transition-opacity">
      {/* Bottom Sheet on mobile (rounded-t-[40px]), Modal on desktop (rounded-[32px]) */}
      <div className="w-full max-w-xl bg-white rounded-t-[40px] md:rounded-[32px] border border-[#bdc8d2]/30 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-200">
        {/* Grab Handle for mobile */}
        <div className="pt-3 pb-1 md:hidden">
          <div className="w-12 h-1.5 bg-[#bdc8d2] rounded-full mx-auto" />
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-[#dfe3e7]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c49f]" />
              <span className="text-xs font-heading font-bold text-[#00658d] uppercase tracking-wider">
                Station Overview
              </span>
              <span className="text-xs text-[#6d7881]">· {station.crowdLevel === 'quiet' ? 'Quiet & Cozy ☁️' : 'Lively & Sweet 🍡'}</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-[#004764]">
              {station.name}
            </h2>
            {station.japaneseName && (
              <div className="text-sm text-[#6d7881] font-medium">
                {station.japaneseName}
              </div>
            )}
          </div>

          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#f0f4f8] hover:bg-[#e4e9ed] text-[#3d4850] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Station Vibe */}
          <div className="p-4 rounded-[24px] bg-[#f0f4f8] text-sm text-[#3d4850] border border-[#dfe3e7] flex items-start gap-3">
            <span className="text-xl">🌸</span>
            <div>
              <div className="font-heading font-bold text-[#00658d] text-xs uppercase mb-0.5">Station Atmosphere</div>
              <p>{station.vibe}</p>
            </div>
          </div>

          {/* Lines & Next Live Departures */}
          <div>
            <div className="text-xs font-heading font-bold text-[#3d4850] mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00baff]" />
              <span>Lines & Live Departures:</span>
            </div>
            <div className="space-y-2">
              {lines.map((ln) => (
                <div
                  key={ln.id}
                  className="p-3.5 rounded-[20px] bg-white border border-[#bdc8d2]/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${ln.color}30` }}
                    >
                      {ln.icon}
                    </span>
                    <div>
                      <div className="font-heading font-bold text-sm text-[#171c1f]">
                        {ln.name}
                      </div>
                      <div className="text-xs text-[#6d7881]">{ln.frequency}</div>
                    </div>
                  </div>

                  <span className="text-xs font-heading font-bold px-3 py-1 rounded-full bg-[#c6e7ff] text-[#004764]">
                    Next in 3 min ✨
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kawaii Amenities */}
          <div>
            <div className="text-xs font-heading font-bold text-[#3d4850] mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#fdb0d7]" />
              <span>Station Amenities & Treats:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {station.amenities.map((am) => (
                <span
                  key={am}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#bdc8d2] text-xs font-medium text-[#004764] shadow-xs"
                >
                  {am}
                </span>
              ))}
            </div>
          </div>

          {/* Stamp Rally Collector Box */}
          <div className="p-4 rounded-[28px] bg-gradient-to-r from-[#ffd8e9]/30 to-[#c6e7ff]/30 border border-[#fdb0d7] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white shadow-marshmallow-pink flex items-center justify-center text-2xl border border-[#fdb0d7]">
                {station.stamp.icon}
              </div>
              <div>
                <div className="text-xs font-heading font-bold text-[#884a6c]">
                  Collectible Station Stamp
                </div>
                <div className="text-sm font-heading font-bold text-[#171c1f]">
                  {station.stamp.title}
                </div>
                <div className="text-xs text-[#6d7881]">
                  {station.stamp.description}
                </div>
              </div>
            </div>

            {isStampUnlocked ? (
              <span className="px-3 py-1 rounded-full bg-white text-[#00c49f] border border-[#00c49f] text-xs font-heading font-bold flex items-center gap-1 whitespace-nowrap">
                <Check className="w-3.5 h-3.5" />
                <span>Collected</span>
              </span>
            ) : (
              <button
                onClick={handleCollect}
                className="candy-btn-pink text-xs font-heading font-bold px-3.5 py-2 rounded-full whitespace-nowrap cursor-pointer"
              >
                Stamp Pass 🖋️
              </button>
            )}
          </div>
        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="p-5 border-t border-[#dfe3e7] bg-[#f0f4f8] flex items-center gap-3">
          <button
            onClick={handlePlanHop}
            className="flex-1 candy-btn-blue py-3.5 px-6 rounded-full font-heading font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Hop to {station.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
