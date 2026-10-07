import React from 'react';
import { Compass, Map, CreditCard, Sparkles } from 'lucide-react';
import { ScreenTab } from './TopNav';
import { sound } from '../utils/audio';

interface BottomTabBarProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ currentTab, onTabChange }) => {
  const tabs: { id: ScreenTab; label: string; icon: React.ReactNode }[] = [
    { id: 'plan', label: 'Plan & Ride', icon: <Compass className="w-5 h-5" /> },
    { id: 'map', label: 'Chibi Map', icon: <Map className="w-5 h-5" /> },
    { id: 'candypass', label: 'CandyPass', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'amenities', label: 'Sweet Stops', icon: <Sparkles className="w-5 h-5" /> },
  ];

  const handleTabClick = (tabId: ScreenTab) => {
    sound.playBubblePop();
    onTabChange(tabId);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#dfe3e7] shadow-[0_-8px_20px_rgba(0,186,255,0.06)] px-2 py-1">
      <div className="grid grid-cols-4 items-center h-14 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id || (tab.id === 'plan' && currentTab === 'live');
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] w-full py-1 cursor-pointer transition-colors focus-visible:outline-none"
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  isActive
                    ? 'text-[#00658d] scale-110'
                    : 'text-[#6d7881] hover:text-[#3d4850]'
                }`}
              >
                {tab.icon}
              </div>
              <span
                className={`text-[10px] font-heading font-semibold tracking-tight leading-none mt-0.5 ${
                  isActive ? 'text-[#00658d]' : 'text-[#6d7881]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
