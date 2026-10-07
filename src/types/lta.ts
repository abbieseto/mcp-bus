export interface LTANextBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
}

export interface LTABusService {
  ServiceNo: string;
  Operator: string;
  NextBus?: LTANextBus;
  NextBus2?: LTANextBus;
  NextBus3?: LTANextBus;
}

export interface LTABusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LTABusService[];
  source?: string;
  note?: string;
  error?: string;
}

export interface LTAServiceAlert {
  id: string;
  category: 'diversion' | 'maintenance' | 'delay' | 'advisory';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedServices: string[];
  affectedBusStops?: string[];
  startTime: string;
  estimatedEndTime?: string;
  advice: string;
  source: string;
}
