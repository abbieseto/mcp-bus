import React, { useState } from 'react';
import { Store, Search, Heart, Navigation, Coffee } from 'lucide-react';
import { STATIONS, TRANSIT_LINES } from '../data/transitData';
import { sound } from '../utils/audio';

interface SweetStopsScreenProps {
  onStationSelect: (stationId: string) => void;
  onPlanTripToStation: (stationId: string) => void;
}

export const SweetStopsScreen: React.FC<SweetStopsScreenProps> = ({
  onStationSelect,
  onPlanTripToStation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [favoritedStationIds, setFavoritedStationIds] = useState<string[]>(['marina-bay', 'bugis', 'orchard']);

  const stationsList = Object.values(STATIONS);

  const tags = [
    { id: 'all', label: 'All SG Stops ✨' },
    { id: 'kaya', label: 'Kaya Toast & Kopi ☕' },
    { id: 'sweets', label: 'Uncle Ice Cream & Boba 🍨' },
    { id: 'gardens', label: 'Scenic Supertrees & Gardens 🌺' },
    { id: 'heritage', label: 'Shophouses & Culture 🎨' },
  ];

  const filteredStations = stationsList.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.japaneseName && st.japaneseName.includes(searchQuery)) ||
      st.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTag === 'all') return true;
    if (selectedTag === 'kaya') return st.amenities.some((a) => a.toLowerCase().includes('kaya') || a.toLowerCase().includes('toast') || a.toLowerCase().includes('cafe'));
    if (selectedTag === 'sweets') return st.amenities.some((a) => a.toLowerCase().includes('ice cream') || a.toLowerCase().includes('tart') || a.toLowerCase().includes('boba') || a.toLowerCase().includes('churros'));
    if (selectedTag === 'gardens') return st.amenities.some((a) => a.toLowerCase().includes('tree') || a.toLowerCase().includes('garden') || a.toLowerCase().includes('vortex') || a.toLowerCase().includes('waterfall'));
    if (selectedTag === 'heritage') return st.amenities.some((a) => a.toLowerCase().includes('shophouse') || a.toLowerCase().includes('heritage') || a.toLowerCase().includes('dragon') || a.toLowerCase().includes('lantern'));
    return true;
  });

  const toggleFavorite = (stId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playBubblePop();
    setFavoritedStationIds((prev) =>
      prev.includes(stId) ? prev.filter((id) => id !== stId) : [...prev, stId]
    );
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="candy-card p-6 sm:p-8 bg-gradient-to-r from-white via-[#ffd8e9]/20 to-[#c6e7ff]/20 shadow-marshmallow-soft">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#fdb0d7] text-xs font-heading font-bold text-[#884a6c] shadow-xs">
            <Store className="w-3.5 h-3.5 text-[#fdb0d7]" />
            <span>Singapore MRT Station Directory & Local Delights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#004764]">
            Sweet Stops & Lion City Corners
          </h1>
          <p className="text-sm text-[#3d4850]">
            Every MRT station in Singapore has something iconic: crispy kaya toast, uncle wafer ice cream carts, glowing Supertrees, and heritage shophouses!
          </p>
        </div>

        {/* Search Bar (Oversized pill input) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#6d7881] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by station (Orchard, Bugis, Marina Bay), kaya toast, uncle ice cream, rain vortex..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white text-sm border-2 border-transparent focus:border-[#00baff] focus:outline-none shadow-inner text-[#171c1f]"
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => {
                sound.playBubblePop();
                setSelectedTag(tag.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                selectedTag === tag.id
                  ? 'bg-[#00658d] text-white shadow-xs'
                  : 'bg-white text-[#3d4850] border border-[#bdc8d2]/60 hover:bg-[#f0f4f8]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStations.map((station) => {
          const isFav = favoritedStationIds.includes(station.id);
          const lines = station.lineIds.map((lid) => TRANSIT_LINES[lid]).filter(Boolean);

          return (
            <div
              key={station.id}
              onClick={() => {
                sound.playBubblePop();
                onStationSelect(station.id);
              }}
              className="candy-card p-6 cursor-pointer hover:shadow-marshmallow-blue hover:border-[#00baff]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Station Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-lg font-heading font-bold text-[#171c1f] group-hover:text-[#00658d] transition-colors">
                      {station.name}
                    </h2>
                    {station.japaneseName && (
                      <span className="text-xs text-[#6d7881] font-normal">
                        {station.japaneseName}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => toggleFavorite(station.id, e)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
                      isFav
                        ? 'bg-[#ffd8e9] text-[#884a6c] border-[#fdb0d7]'
                        : 'bg-[#f0f4f8] text-[#6d7881] border-transparent hover:text-[#884a6c]'
                    }`}
                    title="Bookmark Station"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Vibe Description */}
                <p className="text-xs text-[#3d4850] mb-3">
                  ✨ {station.vibe}
                </p>

                {/* Lines Serving Station */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {lines.map((ln) => (
                    <span
                      key={ln.id}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold flex items-center gap-1"
                      style={{
                        backgroundColor: `${ln.color}25`,
                        color: ln.accentColor,
                        border: `1px solid ${ln.color}`,
                      }}
                    >
                      <span>{ln.icon}</span>
                      <span>{ln.name}</span>
                    </span>
                  ))}
                </div>

                {/* Amenities List */}
                <div className="space-y-1 mb-5">
                  <div className="text-[11px] font-heading font-bold text-[#6d7881] uppercase tracking-wider">
                    Local Treats & Amenities
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {station.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#f0f4f8] text-[#004764] font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#dfe3e7] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-[#7a3f60] font-heading font-bold">
                  <span>{station.stamp.icon}</span>
                  <span>{station.stamp.title}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playSparkleChime();
                    onPlanTripToStation(station.id);
                  }}
                  className="candy-btn-blue text-xs font-heading font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Hop Here</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
