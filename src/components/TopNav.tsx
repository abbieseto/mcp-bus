import React from 'react';
import { Volume2, VolumeX, Sparkles, CreditCard } from 'lucide-react';
import { sound } from '../utils/audio';

export type ScreenTab = 'plan' | 'live' | 'map' | 'candypass' | 'amenities';

interface TopNavProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  passBalance: number;
  onOpenPass: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onTabChange,
  isSoundMuted,
  onToggleSound,
  passBalance,
  onOpenPass,
}) => {
  const handleNavClick = (tab: ScreenTab) => {
    sound.playBubblePop();
    onTabChange(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#dfe3e7] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        {/* Zone 1: Brand title, one line, single text element in display face */}
        <button
          onClick={() => handleNavClick('plan')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00baff] rounded-full px-2 py-1"
        >
          <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-[#00658d] group-hover:text-[#00baff] transition-colors whitespace-nowrap">
            Sky & Candy SG Transit
          </span>
        </button>

        {/* Zone 2: 4-6 nav links, 1-2 word labels, single-line text links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold tracking-normal font-heading">
          <button
            onClick={() => handleNavClick('plan')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              currentTab === 'plan' || currentTab === 'live'
                ? 'text-[#00658d] border-[#00baff]'
                : 'text-[#3d4850] border-transparent hover:text-[#00658d] hover:border-[#bdc8d2]'
            }`}
          >
            Plan & Ride
          </button>
          <button
            onClick={() => handleNavClick('map')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              currentTab === 'map'
                ? 'text-[#00658d] border-[#00baff]'
                : 'text-[#3d4850] border-transparent hover:text-[#00658d] hover:border-[#bdc8d2]'
            }`}
          >
            Chibi Map
          </button>
          <button
            onClick={() => handleNavClick('candypass')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              currentTab === 'candypass'
                ? 'text-[#00658d] border-[#00baff]'
                : 'text-[#3d4850] border-transparent hover:text-[#00658d] hover:border-[#bdc8d2]'
            }`}
          >
            CandyPass
          </button>
          <button
            onClick={() => handleNavClick('amenities')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
              currentTab === 'amenities'
                ? 'text-[#00658d] border-[#00baff]'
                : 'text-[#3d4850] border-transparent hover:text-[#00658d] hover:border-[#bdc8d2]'
            }`}
          >
            Sweet Stops
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle Action */}
          <button
            onClick={onToggleSound}
            title={isSoundMuted ? 'Turn on sound effects' : 'Mute sound effects'}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0f4f8] text-[#3d4850] hover:bg-[#e4e9ed] active:scale-95 transition-transform cursor-pointer border border-[#dfe3e7]"
            aria-label="Toggle Kawaii Sounds"
          >
            {isSoundMuted ? (
              <VolumeX className="w-4 h-4 text-[#6d7881]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#00658d]" />
            )}
          </button>

          {/* CandyPass Quick Action */}
          <button
            onClick={() => {
              sound.playSparkleChime();
              onOpenPass();
            }}
            className="candy-btn-pink h-10 px-3.5 sm:px-4 rounded-full flex items-center gap-2 text-xs sm:text-sm font-heading font-bold cursor-pointer whitespace-nowrap"
          >
            <CreditCard className="w-4 h-4 text-[#7a3f60]" />
            <span>S${passBalance.toFixed(2)}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#884a6c] hidden sm:inline" />
          </button>
        </div>
      </div>
    </header>
  );
};
