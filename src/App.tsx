/**
 * Sky & Candy Transit - Anime Chibi Transit Companion
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { TopNav, ScreenTab } from './components/TopNav';
import { BottomTabBar } from './components/BottomTabBar';
import { PlanExploreScreen } from './components/PlanExploreScreen';
import { LiveJourneyScreen } from './components/LiveJourneyScreen';
import { InteractiveMapScreen } from './components/InteractiveMapScreen';
import { CandyPassScreen } from './components/CandyPassScreen';
import { SweetStopsScreen } from './components/SweetStopsScreen';
import { StationDetailModal } from './components/StationDetailModal';
import { STATIONS, INITIAL_USER_PASS, INITIAL_STAMPS, getSampleRoutes } from './data/transitData';
import { RouteOption, StationStamp } from './types/transit';
import { sound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('plan');
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [passCard, setPassCard] = useState(INITIAL_USER_PASS);
  const [stamps, setStamps] = useState<StationStamp[]>(INITIAL_STAMPS);
  const [activeLiveRoute, setActiveLiveRoute] = useState<RouteOption | null>(null);

  // Selected station for details modal
  const [inspectedStationId, setInspectedStationId] = useState<string | null>(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState<boolean>(false);

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsSoundMuted(nextMuted);
  };

  const handleSelectRouteForLiveTrip = (route: RouteOption) => {
    setActiveLiveRoute(route);
    setCurrentTab('live');
  };

  const handleStationClick = (stationIdOrName: string) => {
    // Try matching by id or name
    const found =
      STATIONS[stationIdOrName] ||
      Object.values(STATIONS).find(
        (s) => s.name.toLowerCase() === stationIdOrName.toLowerCase()
      );
    if (found) {
      setInspectedStationId(found.id);
      setIsStationModalOpen(true);
    }
  };

  const handlePlanTripToStation = (stationId: string) => {
    const route = getSampleRoutes('cloud-central', stationId)[0];
    setActiveLiveRoute(route);
    setCurrentTab('live');
  };

  const handleCollectStamp = (stationId: string) => {
    setStamps((prev) =>
      prev.map((s) =>
        s.stationId === stationId
          ? { ...s, unlocked: true, unlockedAt: 'Just now ✨' }
          : s
      )
    );
  };

  const handleUpdateBalance = (newBalance: number) => {
    setPassCard((prev) => ({
      ...prev,
      balance: newBalance,
      totalRides: prev.totalRides + 1,
    }));
  };

  const inspectedStation = inspectedStationId ? STATIONS[inspectedStationId] || null : null;
  const isInspectedStampUnlocked = inspectedStation
    ? stamps.find((s) => s.stationId === inspectedStation.id)?.unlocked ?? false
    : false;

  return (
    <div className="min-h-screen bg-[#f6fafe] text-[#171c1f] flex flex-col font-sans">
      {/* Top Bar with 3-Zone Contract */}
      <TopNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab !== 'live') {
            setActiveLiveRoute(null);
          }
          setCurrentTab(tab);
        }}
        isSoundMuted={isSoundMuted}
        onToggleSound={handleToggleSound}
        passBalance={passCard.balance}
        onOpenPass={() => setCurrentTab('candypass')}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {currentTab === 'plan' && (
          <PlanExploreScreen
            onSelectRouteForLiveTrip={handleSelectRouteForLiveTrip}
            onStationClick={handleStationClick}
            onExploreMap={() => setCurrentTab('map')}
          />
        )}

        {currentTab === 'live' && activeLiveRoute && (
          <LiveJourneyScreen
            route={activeLiveRoute}
            onBackToPlanner={() => setCurrentTab('plan')}
            onStationClick={handleStationClick}
          />
        )}

        {currentTab === 'map' && (
          <InteractiveMapScreen
            onStationSelect={handleStationClick}
            selectedStationId={inspectedStationId}
          />
        )}

        {currentTab === 'candypass' && (
          <CandyPassScreen
            passCard={passCard}
            stamps={stamps}
            onUpdateBalance={handleUpdateBalance}
            onUnlockStamp={handleCollectStamp}
          />
        )}

        {currentTab === 'amenities' && (
          <SweetStopsScreen
            onStationSelect={handleStationClick}
            onPlanTripToStation={handlePlanTripToStation}
          />
        )}
      </main>

      {/* Station Details Modal / Bottom Sheet */}
      <StationDetailModal
        station={inspectedStation}
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        onPlanTripToStation={handlePlanTripToStation}
        isStampUnlocked={isInspectedStampUnlocked}
        onCollectStamp={handleCollectStamp}
      />

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <BottomTabBar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab !== 'live') {
            setActiveLiveRoute(null);
          }
          setCurrentTab(tab);
        }}
      />

      {/* Clean Footer (No fake engines, clean copyright and links) */}
      <footer className="border-t border-[#dfe3e7] bg-white py-6 px-4 sm:px-8 text-xs text-[#6d7881] hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-[#00658d]">
              Sky & Candy SG Transit
            </span>
            <span>·</span>
            <span>Connecting Singapore's MRT & Bus Lines with Anime Chibi Delight 🇸🇬</span>
          </div>

          <div className="flex items-center gap-4 text-[#3d4850]">
            <button
              onClick={() => setCurrentTab('plan')}
              className="hover:text-[#00658d] cursor-pointer"
            >
              Route Planner
            </button>
            <button
              onClick={() => setCurrentTab('map')}
              className="hover:text-[#00658d] cursor-pointer"
            >
              MRT Network Map
            </button>
            <button
              onClick={() => setCurrentTab('candypass')}
              className="hover:text-[#00658d] cursor-pointer"
            >
              SimplyGo CandyPass
            </button>
            <button
              onClick={() => setCurrentTab('amenities')}
              className="hover:text-[#00658d] cursor-pointer"
            >
              Sweet Stops
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
