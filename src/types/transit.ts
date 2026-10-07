export type TransitMode = 'bus' | 'train' | 'tram' | 'express' | 'ferry';

export interface Station {
  id: string;
  name: string;
  japaneseName?: string;
  lineIds: string[];
  x: number; // For map positioning (percentage 0-100)
  y: number;
  amenities: string[];
  vibe: string;
  crowdLevel: 'quiet' | 'moderate' | 'lively';
  nearbyBusStopCode?: string;
  nearbyBusStopName?: string;
  nearbyBusServices?: string[];
  stamp: {
    id: string;
    title: string;
    icon: string;
    description: string;
  };
}

export interface TransitLine {
  id: string;
  name: string;
  code: string;
  color: string;
  accentColor: string;
  mode: TransitMode;
  icon: string;
  stops: string[]; // station ids in order
  frequency: string;
  status: 'smooth' | 'slight-delay' | 'sparkling';
}

export interface RouteOption {
  id: string;
  badge: 'fastest' | 'sweetest' | 'cheapest' | 'scenic' | 'express';
  badgeLabel: string;
  badgeEmoji: string;
  durationMinutes: number;
  departureTime: string;
  arrivalTime: string;
  price: string;
  caloriesWalked: number;
  transfers: number;
  lines: TransitLine[];
  stopsCount: number;
  co2Saved: string;
  steps: RouteStep[];
}

export interface RouteStep {
  id: string;
  mode: TransitMode | 'walk';
  instruction: string;
  detail: string;
  durationMinutes: number;
  lineId?: string;
  lineName?: string;
  lineColor?: string;
  fromStation: string;
  toStation: string;
  intermediateStops?: string[];
  isTransfer?: boolean;
}

export interface MovingVehicle {
  id: string;
  lineId: string;
  lineName: string;
  color: string;
  mode: TransitMode;
  progress: number; // 0 to 1 along its segment
  fromStationId: string;
  toStationId: string;
  nextStopName: string;
  etaMinutes: number;
}

export interface CandyPassCard {
  cardNumber: string;
  cardHolder: string;
  balance: number;
  status: 'active' | 'low-balance';
  tier: 'Sugar Star' | 'Strawberry Ribbon' | 'Marshmallow VIP';
  expiry: string;
  totalRides: number;
}

export interface StationStamp {
  id: string;
  stationId: string;
  stationName: string;
  title: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  description: string;
}
