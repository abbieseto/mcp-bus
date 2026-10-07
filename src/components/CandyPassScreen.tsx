import React, { useState } from 'react';
import { CreditCard, QrCode, Sparkles, PlusCircle, CheckCircle2, Award, History, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import { CandyPassCard, StationStamp } from '../types/transit';
import { sound } from '../utils/audio';
import { ASSETS } from '../assets/images';

interface CandyPassScreenProps {
  passCard: CandyPassCard;
  stamps: StationStamp[];
  onUpdateBalance: (newBalance: number) => void;
  onUnlockStamp?: (stampId: string) => void;
}

export const CandyPassScreen: React.FC<CandyPassScreenProps> = ({
  passCard,
  stamps,
  onUpdateBalance,
}) => {
  const [showQR, setShowQR] = useState<boolean>(false);
  const [tapStatus, setTapStatus] = useState<'idle' | 'tapping' | 'success'>('idle');
  const [selectedReloadAmount, setSelectedReloadAmount] = useState<number>(10);
  const [recentTransactions, setRecentTransactions] = useState<{
    id: string;
    description: string;
    amount: string;
    type: 'fare' | 'reload';
    time: string;
  }[]>([
    { id: 'tx-1', description: 'Downtown Line MRT · Botanic Gardens to Bugis', amount: '-S$1.85', type: 'fare', time: 'Today 09:40' },
    { id: 'tx-2', description: 'Double-Decker Bus #190 · Orchard Road', amount: '-S$1.28', type: 'fare', time: 'Yesterday 17:15' },
    { id: 'tx-3', description: 'PayNow Top-Up (DBS PayLah!)', amount: '+S$20.00', type: 'reload', time: 'Yesterday 12:00' },
  ]);

  const handleTapToPay = () => {
    if (tapStatus !== 'idle') return;
    setTapStatus('tapping');
    sound.playBubblePop();

    setTimeout(() => {
      sound.playTurnstileBeep();
      const fare = 1.85;
      const updated = Math.max(0, passCard.balance - fare);
      onUpdateBalance(updated);

      setRecentTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          description: 'SimplyGo Gantry · Marina Bay Sands Tap-In',
          amount: '-S$1.85',
          type: 'fare',
          time: 'Just now',
        },
        ...prev,
      ]);

      setTapStatus('success');
      setTimeout(() => {
        setTapStatus('idle');
      }, 2400);
    }, 700);
  };

  const handleReload = () => {
    sound.playSparkleChime();
    const updated = passCard.balance + selectedReloadAmount;
    onUpdateBalance(updated);

    setRecentTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        description: `PayNow SimplyGo Reload (+S$${selectedReloadAmount})`,
        amount: `+S$${selectedReloadAmount}.00`,
        type: 'reload',
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  const unlockedCount = stamps.filter((s) => s.unlocked).length;

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#004764] flex items-center gap-2">
            <span>SimplyGo CandyPass SG</span>
            <Sparkles className="w-5 h-5 text-[#fdb0d7]" />
          </h1>
          <p className="text-sm text-[#3d4850]">
            Singapore CEPAS contactless smart transit card with holographic collectible perks and stamp rally
          </p>
        </div>

        <button
          onClick={() => {
            sound.playBubblePop();
            setShowQR(!showQR);
          }}
          className="h-10 px-4 rounded-full bg-white hover:bg-[#f0f4f8] text-[#00658d] font-heading font-bold text-xs sm:text-sm border border-[#bdc8d2]/60 flex items-center gap-2 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
        >
          <QrCode className="w-4 h-4 text-[#00baff]" />
          <span>{showQR ? 'Hide Gantry QR' : 'Show Gantry QR'}</span>
        </button>
      </div>

      {/* Holographic Virtual SimplyGo CandyPass Card */}
      <div className="relative group max-w-lg mx-auto">
        <div className="relative overflow-hidden rounded-[32px] p-6 sm:p-8 bg-gradient-to-tr from-[#00baff] via-[#b1a2ff] to-[#fdb0d7] text-white shadow-marshmallow-blue border-2 border-white/60">
          {/* Card Holographic Sheen Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

          {/* Top Card Row */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-lg tracking-tight text-white drop-shadow-sm block leading-none">
                  SimplyGo CandyPass™
                </span>
                <span className="text-[10px] text-white/80 font-mono tracking-wider">
                  CEPAS SINGAPORE · EZ-LINK READY
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-white/30 backdrop-blur-md text-white border border-white/40 shadow-xs">
              {passCard.tier} 🌸
            </span>
          </div>

          {/* Balance Display */}
          <div className="relative z-10 mb-8">
            <div className="text-xs uppercase font-heading font-bold tracking-wider text-white/80 mb-0.5">
              Available Transit Balance
            </div>
            <div className="text-4xl sm:text-5xl font-heading font-bold tracking-tight text-white drop-shadow-md">
              S${passCard.balance.toFixed(2)}
            </div>
          </div>

          {/* Bottom Card Row */}
          <div className="relative z-10 flex items-end justify-between pt-4 border-t border-white/25 text-xs">
            <div>
              <div className="text-white/80 font-heading font-semibold text-[11px]">Card ID (CAN)</div>
              <div className="font-mono tracking-wider text-white text-sm font-bold">
                {passCard.cardNumber}
              </div>
            </div>

            <div className="text-right">
              <div className="text-white/80 font-heading font-semibold text-[11px]">Lion City Rides</div>
              <div className="font-heading font-bold text-white text-sm">
                {passCard.totalRides} MRT & Bus Hops 🦁
              </div>
            </div>
          </div>
        </div>

        {/* Turnstile QR Code Expansion */}
        {showQR && (
          <div className="mt-4 candy-card p-6 text-center animate-sparkle">
            <div className="font-heading font-bold text-sm text-[#004764] mb-3">
              Scan at SMRT / SBS Transit Gantry Reader
            </div>
            <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl border-2 border-[#00baff] flex items-center justify-center shadow-inner">
              <QrCode className="w-32 h-32 text-[#00658d]" />
            </div>
            <div className="text-xs text-[#6d7881] mt-3 font-mono">
              SIMPLYGO DYNAMIC TOKEN · AUTO-REFRESHING EVERY 60S
            </div>
          </div>
        )}
      </div>

      {/* Interactive NFC Tap & Quick Reload Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tap to Board Simulator */}
        <div className="candy-card p-6 shadow-marshmallow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#c6e7ff] text-[#00658d] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-base font-heading font-bold text-[#171c1f]">
                MRT Gantry NFC Tap Simulator
              </h2>
            </div>
            <p className="text-xs text-[#6d7881] mb-5">
              Experience the friendly chime and contactless payment at any Singapore MRT gantry. Standard adult fare: S$1.85.
            </p>
          </div>

          <button
            onClick={handleTapToPay}
            disabled={tapStatus !== 'idle'}
            className={`w-full py-4 px-6 rounded-full font-heading font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
              tapStatus === 'success'
                ? 'bg-[#00c49f] text-white shadow-md'
                : tapStatus === 'tapping'
                ? 'bg-[#00baff] text-white animate-pulse'
                : 'candy-btn-blue'
            }`}
          >
            {tapStatus === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Gantry Opened! Have a sweet trip! 🎉</span>
              </>
            ) : tapStatus === 'tapping' ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Validating SimplyGo CEPAS Chip...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Tap Gantry (S$1.85 Fare) 🔔</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Reload Card */}
        <div className="candy-card p-6 shadow-marshmallow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#ffd8e9] text-[#884a6c] flex items-center justify-center">
                <PlusCircle className="w-4 h-4" />
              </div>
              <h2 className="text-base font-heading font-bold text-[#171c1f]">
                Instant PayNow / Card Top-Up
              </h2>
            </div>
            <p className="text-xs text-[#6d7881] mb-4">
              Select amount and refill your SimplyGo balance via PayNow, PayLah!, or Apple Pay with zero convenience fee.
            </p>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {[5, 10, 20, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    sound.playBubblePop();
                    setSelectedReloadAmount(amt);
                  }}
                  className={`py-2 rounded-full text-xs font-heading font-bold border transition-all cursor-pointer ${
                    selectedReloadAmount === amt
                      ? 'bg-[#ffd8e9] text-[#7a3f60] border-[#fdb0d7] shadow-xs'
                      : 'bg-[#f0f4f8] text-[#3d4850] border-transparent hover:bg-[#e4e9ed]'
                  }`}
                >
                  +S${amt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReload}
            className="w-full py-4 px-6 rounded-full font-heading font-bold text-sm candy-btn-pink flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Top Up +S${selectedReloadAmount}.00 Now</span>
          </button>
        </div>
      </div>

      {/* Collectible Singapore Station Stamp Rally */}
      <div className="candy-card p-6 sm:p-8 shadow-marshmallow-pink border border-[#fdb0d7]/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#00baff] to-[#fdb0d7] shadow-xs">
              <img
                src={ASSETS.candyPassBadge}
                alt="Singapore Station Stamp Badge"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-[#171c1f] flex items-center gap-2">
                <span>Lion City Station Stamp Rally</span>
                <Award className="w-4 h-4 text-[#884a6c]" />
              </h2>
              <p className="text-xs text-[#6d7881]">
                Collect digital ink stamps by visiting Singapore's iconic landmarks and heritage MRT stops!
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#ffd8e9] text-[#7a3f60] text-xs font-heading font-bold self-start sm:self-auto">
            {unlockedCount} of {stamps.length} Stamps Collected
          </div>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stamps.map((stamp) => (
            <div
              key={stamp.id}
              onClick={() => {
                if (stamp.unlocked) {
                  sound.playSparkleChime();
                } else {
                  sound.playBubblePop();
                }
              }}
              className={`p-4 rounded-[24px] border text-center transition-all cursor-pointer relative group ${
                stamp.unlocked
                  ? 'bg-gradient-to-b from-white to-[#ffd8e9]/20 border-[#fdb0d7] shadow-xs hover:shadow-md'
                  : 'bg-[#f0f4f8]/50 border-dashed border-[#bdc8d2] opacity-60 hover:opacity-80'
              }`}
            >
              {/* Stamp Circle */}
              <div
                className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110 ${
                  stamp.unlocked
                    ? 'bg-white shadow-marshmallow-pink border-2 border-[#fdb0d7]'
                    : 'bg-white border-2 border-dashed border-[#bdc8d2]'
                }`}
              >
                <span>{stamp.unlocked ? stamp.icon : '🔒'}</span>
              </div>

              <div className="font-heading font-bold text-xs text-[#171c1f] truncate">
                {stamp.title}
              </div>
              <div className="text-[11px] text-[#6d7881] truncate">
                {stamp.stationName}
              </div>

              {stamp.unlocked && stamp.unlockedAt && (
                <div className="text-[10px] text-[#884a6c] font-semibold mt-1">
                  ✓ {stamp.unlockedAt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trips & Transactions */}
      <div className="candy-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-heading font-bold text-[#171c1f] flex items-center gap-2">
            <History className="w-4 h-4 text-[#00658d]" />
            <span>Recent SMRT & SBS Transit Trips</span>
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-[#6d7881]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00baff]" />
            <span>SimplyGo Live Ledger</span>
          </div>
        </div>

        <div className="divide-y divide-[#dfe3e7]">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    tx.type === 'reload'
                      ? 'bg-[#c6e7ff] text-[#00658d]'
                      : 'bg-[#ffd8e9] text-[#7a3f60]'
                  }`}
                >
                  {tx.type === 'reload' ? <ArrowUpRight className="w-4 h-4" /> : '🚆'}
                </div>
                <div>
                  <div className="font-semibold text-[#171c1f]">{tx.description}</div>
                  <div className="text-[11px] text-[#6d7881]">{tx.time}</div>
                </div>
              </div>

              <span
                className={`font-mono font-bold ${
                  tx.type === 'reload' ? 'text-[#00c49f]' : 'text-[#3d4850]'
                }`}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
