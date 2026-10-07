import React, { useState } from 'react';
import { ArrowLeft, Bell, BellRing, Check, MapPin, Footprints, AlertCircle, Heart } from 'lucide-react';
import { RouteOption } from '../types/transit';
import { sound } from '../utils/audio';
import { ASSETS } from '../assets/images';

interface LiveJourneyScreenProps {
  route: RouteOption;
  onBackToPlanner: () => void;
  onStationClick: (stationName: string) => void;
}

export const LiveJourneyScreen: React.FC<LiveJourneyScreenProps> = ({
  route,
  onBackToPlanner,
  onStationClick,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1); // Started step 1
  const [stopRequested, setStopRequested] = useState<boolean>(false);
  const [likedRoute, setLikedRoute] = useState<boolean>(false);

  const handleRequestStop = () => {
    sound.playStationDing();
    setStopRequested(true);
  };

  const handleNextStep = () => {
    sound.playBubblePop();
    if (currentStepIndex < route.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      sound.playSparkleChime();
    }
  };

  const handlePrevStep = () => {
    sound.playBubblePop();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const currentStep = route.steps[currentStepIndex];

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            sound.playBubblePop();
            onBackToPlanner();
          }}
          className="h-10 px-4 rounded-full bg-white hover:bg-[#f0f4f8] text-[#00658d] font-heading font-bold text-xs sm:text-sm border border-[#bdc8d2]/60 flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Navigation</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playBubblePop();
              setLikedRoute(!likedRoute);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${
              likedRoute
                ? 'bg-[#ffd8e9] text-[#884a6c] border-[#fdb0d7]'
                : 'bg-white text-[#6d7881] border-[#bdc8d2]/60 hover:text-[#884a6c]'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${likedRoute ? 'fill-current' : ''}`} />
          </button>

          <div className="px-3.5 py-1.5 rounded-full bg-[#c6e7ff] text-[#004764] text-xs font-heading font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00baff] animate-ping" />
            <span>Live Trip Active</span>
          </div>
        </div>
      </div>

      {/* Main Active Banner Card */}
      <div className="candy-card p-6 sm:p-8 bg-gradient-to-br from-[#00baff]/15 via-white to-[#ffd8e9]/20 shadow-marshmallow-blue border-2 border-[#00baff]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#00658d]">
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#00baff]/30 shadow-xs">
                Step {currentStepIndex + 1} of {route.steps.length}
              </span>
              <span>· Estimated Arrival {route.arrivalTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#004764]">
              {currentStep.instruction}
            </h1>

            <p className="text-sm text-[#3d4850] font-normal">
              {currentStep.detail}
            </p>
          </div>

          {/* Squishy Stop Request Bell */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleRequestStop}
              className={`w-full sm:w-auto h-12 px-6 rounded-full font-heading font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                stopRequested
                  ? 'bg-[#ffdad6] text-[#93000a] border-2 border-[#ba1a1a] shadow-xs'
                  : 'candy-btn-pink'
              }`}
            >
              {stopRequested ? (
                <>
                  <BellRing className="w-5 h-5 text-[#ba1a1a] animate-bounce" />
                  <span>Stop Requested! 🛑</span>
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  <span>Request Stop 🔔</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Step Stepper Bar */}
        <div className="mt-6 pt-5 border-t border-[#bdc8d2]/30 flex items-center justify-between gap-2">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="text-xs font-heading font-bold px-3 py-1.5 rounded-full bg-white disabled:opacity-40 hover:bg-[#f0f4f8] text-[#00658d] border border-[#bdc8d2]/60 cursor-pointer"
          >
            ← Previous Step
          </button>

          <span className="text-xs font-heading font-semibold text-[#6d7881]">
            Remaining time: {route.steps.slice(currentStepIndex).reduce((acc, s) => acc + s.durationMinutes, 0)} mins
          </span>

          <button
            onClick={handleNextStep}
            disabled={currentStepIndex === route.steps.length - 1}
            className="text-xs font-heading font-bold px-4 py-1.5 rounded-full candy-btn-blue disabled:opacity-40 cursor-pointer"
          >
            {currentStepIndex === route.steps.length - 1 ? 'Trip Completed 🎉' : 'Next Step →'}
          </button>
        </div>
      </div>

      {/* Chibi Conductor Advice Box */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-white border border-[#fdb0d7] shadow-marshmallow-pink flex items-center gap-4">
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#00baff] to-[#fdb0d7] shadow-sm">
          <img
            src={ASSETS.mascotConductor}
            alt="Merly Conductor"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full bg-white"
          />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <div className="font-heading font-bold text-[#884a6c] flex items-center gap-1.5 mb-0.5">
            <span>Conductor Merly says:</span>
            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-[#ffd8e9] text-[#7a3f60]">
              Lion City Commuter Tip 🦁
            </span>
          </div>
          <p className="text-[#3d4850] leading-snug">
            "Remember to tap your SimplyGo CandyPass at the MRT gantry! Stand on the left of the escalators, doors open on the left at your interchange, and save room for some crispy kaya toast at the concourse! 🌸✨"
          </p>
        </div>
      </div>

      {/* The Soft Noodle / Tube Vertical Route Timeline */}
      <div className="candy-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading font-bold text-[#171c1f]">
            Journey Timeline & Station Stops
          </h2>
          <span className="text-xs font-semibold text-[#6d7881]">
            Thick Soft-Noodle Tracking
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8">
          {/* THE SOFT NOODLE: Thick (6px) vertical line with rounded ends */}
          <div className="absolute left-[31px] sm:left-[39px] top-3 bottom-6 w-[6px] rounded-full bg-gradient-to-b from-[#00c49f] via-[#00baff] to-[#7d5fff]" />

          {route.steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isUpcoming = idx > currentStepIndex;

            return (
              <div key={step.id} className="relative flex items-start gap-4 sm:gap-6 group">
                {/* Station Node Badge */}
                <div className="relative z-10 shrink-0">
                  {isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-[#00c49f] text-white flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#00baff] text-white flex items-center justify-center shadow-marshmallow-blue ring-4 ring-[#c6e7ff] animate-pulse">
                        <MapPin className="w-4 h-4 fill-white" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ffd8e9] border-2 border-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white border-3 border-[#bdc8d2] text-[#6d7881] flex items-center justify-center shadow-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#bdc8d2]" />
                    </div>
                  )}
                </div>

                {/* Content Box */}
                <div
                  className={`flex-1 p-4 sm:p-5 rounded-[24px] transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#e6f8ff] to-white border-2 border-[#00baff] shadow-marshmallow-blue'
                      : isCompleted
                      ? 'bg-[#f0f4f8]/80 border border-[#dfe3e7] opacity-85'
                      : 'bg-white border border-[#bdc8d2]/40 hover:border-[#bdc8d2]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm sm:text-base text-[#171c1f]">
                        {step.fromStation}
                      </span>
                      {step.isTransfer && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-[#ffd8e9] text-[#7a3f60]">
                          Transfer Hub
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#00658d]">
                      {step.durationMinutes} mins
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#3d4850] font-normal mb-2">
                    {step.instruction} — {step.detail}
                  </p>

                  {/* Intermediate Stops pill toggle */}
                  {step.intermediateStops && step.intermediateStops.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#bdc8d2]/30 flex items-center gap-1.5 text-xs text-[#6d7881]">
                      <Footprints className="w-3.5 h-3.5 text-[#00baff]" />
                      <span>Passing through:</span>
                      <span className="font-semibold text-[#004764]">
                        {step.intermediateStops.join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Station Quick Peek */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => onStationClick(step.fromStation)}
                      className="text-[11px] font-heading font-bold text-[#00658d] hover:text-[#00baff] underline transition-colors cursor-pointer"
                    >
                      View {step.fromStation} Amenities & Stamp
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & Comfort Status Bar */}
      <div className="p-4 rounded-[24px] bg-[#f0f4f8] border border-[#dfe3e7] flex items-center justify-between text-xs text-[#3d4850]">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#00c49f]" />
          <span>Vehicle Air Filtration: 100% Crisp & Clean · Temperature: 22°C (Cozy)</span>
        </div>
        <span className="font-heading font-bold text-[#00658d]">Car 03</span>
      </div>
    </div>
  );
};
