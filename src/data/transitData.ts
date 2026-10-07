import { Station, TransitLine, RouteOption, CandyPassCard, StationStamp, MovingVehicle } from '../types/transit';

export const STATIONS: Record<string, Station> = {
  'botanic-gardens': {
    id: 'botanic-gardens',
    name: 'Botanic Gardens',
    japaneseName: '植物园 · DT9/CC19',
    lineIds: ['sky-dtl', 'candy-ccl'],
    x: 24,
    y: 28,
    nearbyBusStopCode: '41021',
    nearbyBusStopName: 'Botanic Gdns Stn',
    nearbyBusServices: ['48', '66', '67', '151', '153', '154', '156', '170', '171'],
    amenities: ['Swan Lake Gazebo 🦢', 'National Orchid Garden', 'Garden Picnic Pavilion', 'Puff & Choux Bakery'],
    vibe: 'Lush UNESCO rainforest with fragrant tropical orchids',
    crowdLevel: 'quiet',
    stamp: {
      id: 'stamp-botanic',
      title: 'Orchid Bloom Seeker',
      icon: '🌺',
      description: 'Found the rare hybrid Vanda Miss Joaquim orchid'
    }
  },
  'orchard': {
    id: 'orchard',
    name: 'Orchard Road',
    japaneseName: '乌节路 · NS22/TE14',
    lineIds: ['candy-ccl', 'fluffy-bus'],
    x: 38,
    y: 38,
    nearbyBusStopCode: '08057',
    nearbyBusStopName: 'Orchard Plaza / Somest',
    nearbyBusServices: ['7', '14', '16', '65', '106', '111', '123', '175', '502'],
    amenities: ['Uncle Wafer Ice Cream Cart 🍨', 'Takashimaya Food Hall', 'Sanrio & Pop Mart Megastore', 'Matcha Crepe Corner'],
    vibe: 'Vibrant neon shopping avenue with sweet street treats',
    crowdLevel: 'lively',
    stamp: {
      id: 'stamp-orchard',
      title: 'Orchard Shopaholic',
      icon: '🛍️',
      description: 'Bought a crispy rainbow bread ice cream from the sidewalk uncle'
    }
  },
  'bugis': {
    id: 'bugis',
    name: 'Bugis & Haji Lane',
    japaneseName: '武吉士 · DT14/EW12',
    lineIds: ['sky-dtl', 'candy-ccl'],
    x: 58,
    y: 44,
    nearbyBusStopCode: '01112',
    nearbyBusStopName: 'Bugis Junction',
    nearbyBusServices: ['2', '12', '33', '130', '133', '197', '851', '960'],
    amenities: ['Pastel Shophouse Cafes ☕', 'Turkish Mosaic Lamps', 'Gachapon Haven (100+ Pods)', 'Artisan Churros & Boba'],
    vibe: 'Arty street murals, fairy lights, and icy cold Teh Tarik',
    crowdLevel: 'lively',
    stamp: {
      id: 'stamp-bugis',
      title: 'Haji Lane Wanderer',
      icon: '🎨',
      description: 'Snapped purikura photos by the colorful shophouses'
    }
  },
  'marina-bay': {
    id: 'marina-bay',
    name: 'Marina Bay Sands',
    japaneseName: '滨海湾 · DT16/NS27',
    lineIds: ['sky-dtl', 'marina-ferry'],
    x: 74,
    y: 62,
    nearbyBusStopCode: '04121',
    nearbyBusStopName: 'Old Parliament House (Supreme Ct)',
    nearbyBusServices: ['7', '14', '190', '197', '961'],
    amenities: ['Gardens by the Bay Supertrees 🌸', 'Cloud Forest Mist Walk', 'Kaya Toast Concourse', 'SkyPark Infinity Deck'],
    vibe: 'Glittering waterfront with breezy evening laser light shows',
    crowdLevel: 'moderate',
    stamp: {
      id: 'stamp-marina',
      title: 'SuperTree Sparkler',
      icon: '✨',
      description: 'Watched the glowing purple Supertrees dance to music'
    }
  },
  'chinatown': {
    id: 'chinatown',
    name: 'Chinatown Heritage',
    japaneseName: '牛车水 · DT19/NE4',
    lineIds: ['sky-dtl', 'violet-nel', 'fluffy-bus'],
    x: 48,
    y: 64,
    nearbyBusStopCode: '05019',
    nearbyBusStopName: 'Chinatown Stn Exit C',
    nearbyBusServices: ['2', '12', '33', '54', '61', '143', '147', '190'],
    amenities: ['Golden Custard Egg Tart Bakery 🥧', 'Brown Sugar Boba Street', 'Traditional Herbal Tea Shop', 'Lantern Canopy Walk'],
    vibe: 'Warm pandan scents, red lantern canopy, sizzling street snacks',
    crowdLevel: 'lively',
    stamp: {
      id: 'stamp-chinatown',
      title: 'Egg Tart Connoisseur',
      icon: '🥮',
      description: 'Tasted the flaky custard egg tart fresh out of the oven'
    }
  },
  'clarke-quay': {
    id: 'clarke-quay',
    name: 'Clarke Quay Riverside',
    japaneseName: '克拉码头 · NE5',
    lineIds: ['violet-nel', 'fluffy-bus', 'marina-ferry'],
    x: 42,
    y: 54,
    nearbyBusStopCode: '03222',
    nearbyBusStopName: 'Clarke Quay Stn',
    nearbyBusServices: ['2', '12', '33', '51', '54', '61', '147', '190'],
    amenities: ['Pastel Umbrella Promenade ⛱️', 'Electric Bumboat Pier', 'Artisan Gelato Bar', 'Evening Neon Fountain'],
    vibe: 'Gentle river breezes with pastel glowing bridges',
    crowdLevel: 'moderate',
    stamp: {
      id: 'stamp-clarke',
      title: 'River Breeze Cruiser',
      icon: '⛵',
      description: 'Boarded the vintage painted electric bumboat along the Singapore River'
    }
  },
  'harbourfront': {
    id: 'harbourfront',
    name: 'HarbourFront & Vivacity',
    japaneseName: '港湾 · NE1/CC29',
    lineIds: ['violet-nel'],
    x: 30,
    y: 72,
    nearbyBusStopCode: '14141',
    nearbyBusStopName: 'HarbourFront Stn / Vivocity',
    nearbyBusServices: ['10', '30', '57', '61', '65', '80', '97', '100', '131', '143', '145', '166'],
    amenities: ['Seaside Boardwalk 🎡', 'Kaya Butter Toast Lounge', 'Sentosa Monorail Terminal', 'Rooftop Water Play Park'],
    vibe: 'Cruise ships docking against the blue sea horizon',
    crowdLevel: 'lively',
    stamp: {
      id: 'stamp-harbourfront',
      title: 'Harbour Lookout',
      icon: '🚢',
      description: 'Caught the cable car gliding above the tropical jungle canopy'
    }
  },
  'changi-airport': {
    id: 'changi-airport',
    name: 'Changi Jewel Vortex',
    japaneseName: '樟宜机场 · CG2',
    lineIds: ['candy-ccl'],
    x: 90,
    y: 26,
    nearbyBusStopCode: '95019',
    nearbyBusStopName: 'Changi Airport PTB2',
    nearbyBusServices: ['24', '27', '34', '36', '53', '110', '858'],
    amenities: ['Rain Vortex Waterfall (40m!) 🌊', 'Canopy Park Glass Bridge', 'Bake Cheese Tart Kiosk', 'Pokemon Center SG'],
    vibe: 'World-famous indoor rainforest surrounded by clouds',
    crowdLevel: 'moderate',
    stamp: {
      id: 'stamp-changi',
      title: 'Jewel Cloud Chaser',
      icon: '💎',
      description: 'Stood in awe at the 40-meter indoor rain vortex waterfall'
    }
  },
  'toa-payoh': {
    id: 'toa-payoh',
    name: 'Toa Payoh Central',
    japaneseName: '大巴窑 · NS19',
    lineIds: ['fluffy-bus'],
    x: 46,
    y: 16,
    nearbyBusStopCode: '52009',
    nearbyBusStopName: 'Toa Payoh Bus Interchange',
    nearbyBusServices: ['26', '28', '73', '88', '105', '139', '142', '143', '145', '155', '157', '159', '163'],
    amenities: ['Iconic Dragon Playground 🐉', 'Old-School Butter Cakes', 'Hawker Carrot Cake Stall', 'Town Plaza Water Fountain'],
    vibe: 'Nostalgic heartland warmth with colorful vintage mosaic playground',
    crowdLevel: 'quiet',
    stamp: {
      id: 'stamp-toapayoh',
      title: 'Dragon Playground Explorer',
      icon: '🐲',
      description: 'Slid down the nostalgic 1979 mosaic dragon slide'
    }
  },
  'sentosa-cove': {
    id: 'sentosa-cove',
    name: 'Sentosa Merlion Cove',
    japaneseName: '圣淘沙 · Beach Stn',
    lineIds: ['marina-ferry'],
    x: 28,
    y: 84,
    nearbyBusStopCode: '14539',
    nearbyBusStopName: 'Sentosa Pavilion / Beach',
    nearbyBusServices: ['123', 'RWS8'],
    amenities: ['Palawan Beach Suspension Bridge 🏝️', 'Coconut Ice Cream Shack', 'Giant Chibi Merlion Statue', 'Cable Car Station'],
    vibe: 'Golden tropical beach with gentle pastel turquoise waves',
    crowdLevel: 'moderate',
    stamp: {
      id: 'stamp-sentosa',
      title: 'Island Breeze Vacationer',
      icon: '🥥',
      description: 'Crossed the wooden bridge to the southernmost point of continental Asia'
    }
  }
};

export const TRANSIT_LINES: Record<string, TransitLine> = {
  'sky-dtl': {
    id: 'sky-dtl',
    name: 'Sky Blue Downtown Line',
    code: 'DTL',
    color: '#00baff',
    accentColor: '#00658d',
    mode: 'train',
    icon: '🚆',
    stops: ['botanic-gardens', 'bugis', 'marina-bay', 'chinatown'],
    frequency: 'Every 3 mins',
    status: 'sparkling'
  },
  'candy-ccl': {
    id: 'candy-ccl',
    name: 'Candy Pink Circle & Changi',
    code: 'CCL',
    color: '#fdb0d7',
    accentColor: '#884a6c',
    mode: 'tram',
    icon: '🚋',
    stops: ['orchard', 'botanic-gardens', 'bugis', 'changi-airport'],
    frequency: 'Every 4 mins',
    status: 'smooth'
  },
  'violet-nel': {
    id: 'violet-nel',
    name: 'Magical Violet North-East',
    code: 'NEL',
    color: '#7d5fff',
    accentColor: '#603de0',
    mode: 'express',
    icon: '⚡',
    stops: ['harbourfront', 'chinatown', 'clarke-quay'],
    frequency: 'Every 3.5 mins',
    status: 'sparkling'
  },
  'fluffy-bus': {
    id: 'fluffy-bus',
    name: 'Pandan Green Double-Decker #190',
    code: 'B-190',
    color: '#00c49f',
    accentColor: '#008b70',
    mode: 'bus',
    icon: '🚌',
    stops: ['toa-payoh', 'orchard', 'clarke-quay', 'chinatown'],
    frequency: 'Every 5 mins',
    status: 'smooth'
  },
  'marina-ferry': {
    id: 'marina-ferry',
    name: 'Singapore River Cruise & Ferry',
    code: 'F-MB',
    color: '#38bdf8',
    accentColor: '#0284c7',
    mode: 'ferry',
    icon: '⛴️',
    stops: ['clarke-quay', 'marina-bay', 'sentosa-cove'],
    frequency: 'Every 15 mins',
    status: 'smooth'
  }
};

export const INITIAL_USER_PASS: CandyPassCard = {
  cardNumber: 'SG-8821-9904-CEPAS',
  cardHolder: 'Abigail Seto',
  balance: 24.50,
  status: 'active',
  tier: 'Strawberry Ribbon',
  expiry: '12/28',
  totalRides: 48
};

export const INITIAL_STAMPS: StationStamp[] = [
  {
    id: 'stamp-marina',
    stationId: 'marina-bay',
    stationName: 'Marina Bay Sands',
    title: 'SuperTree Sparkler',
    icon: '✨',
    unlocked: true,
    unlockedAt: 'Yesterday 19:45',
    description: 'Watched the glowing purple Supertrees dance to music'
  },
  {
    id: 'stamp-orchard',
    stationId: 'orchard',
    stationName: 'Orchard Road',
    title: 'Orchard Shopaholic',
    icon: '🛍️',
    unlocked: true,
    unlockedAt: 'Today 11:20',
    description: 'Bought a crispy rainbow bread ice cream from the sidewalk uncle'
  },
  {
    id: 'stamp-bugis',
    stationId: 'bugis',
    stationName: 'Bugis & Haji Lane',
    title: 'Haji Lane Wanderer',
    icon: '🎨',
    unlocked: true,
    unlockedAt: '2 days ago',
    description: 'Snapped purikura photos by the colorful shophouses'
  },
  {
    id: 'stamp-chinatown',
    stationId: 'chinatown',
    stationName: 'Chinatown Heritage',
    title: 'Egg Tart Connoisseur',
    icon: '🥮',
    unlocked: false,
    description: 'Tasted the flaky custard egg tart fresh out of the oven'
  },
  {
    id: 'stamp-botanic',
    stationId: 'botanic-gardens',
    stationName: 'Botanic Gardens',
    title: 'Orchid Bloom Seeker',
    icon: '🌺',
    unlocked: false,
    description: 'Found the rare hybrid Vanda Miss Joaquim orchid'
  },
  {
    id: 'stamp-changi',
    stationId: 'changi-airport',
    stationName: 'Changi Jewel Vortex',
    title: 'Jewel Cloud Chaser',
    icon: '💎',
    unlocked: false,
    description: 'Stood in awe at the 40-meter indoor rain vortex waterfall'
  },
  {
    id: 'stamp-clarke',
    stationId: 'clarke-quay',
    stationName: 'Clarke Quay Riverside',
    title: 'River Breeze Cruiser',
    icon: '⛵',
    unlocked: false,
    description: 'Boarded the vintage painted electric bumboat along the Singapore River'
  },
  {
    id: 'stamp-toapayoh',
    stationId: 'toa-payoh',
    stationName: 'Toa Payoh Central',
    title: 'Dragon Playground Explorer',
    icon: '🐲',
    unlocked: false,
    description: 'Slid down the nostalgic 1979 mosaic dragon slide'
  }
];

export const INITIAL_VEHICLES: MovingVehicle[] = [
  {
    id: 'v-sg-dtl-01',
    lineId: 'sky-dtl',
    lineName: 'Sky Blue Downtown Line',
    color: '#00baff',
    mode: 'train',
    progress: 0.4,
    fromStationId: 'botanic-gardens',
    toStationId: 'bugis',
    nextStopName: 'Bugis & Haji Lane',
    etaMinutes: 2
  },
  {
    id: 'v-sg-dtl-02',
    lineId: 'sky-dtl',
    lineName: 'Sky Blue Downtown Line',
    color: '#00baff',
    mode: 'train',
    progress: 0.8,
    toStationId: 'marina-bay',
    fromStationId: 'bugis',
    nextStopName: 'Marina Bay Sands',
    etaMinutes: 1
  },
  {
    id: 'v-sg-ccl-01',
    lineId: 'candy-ccl',
    lineName: 'Candy Pink Circle & Changi',
    color: '#fdb0d7',
    mode: 'tram',
    progress: 0.6,
    fromStationId: 'bugis',
    toStationId: 'changi-airport',
    nextStopName: 'Changi Jewel Vortex',
    etaMinutes: 4
  },
  {
    id: 'v-sg-nel-01',
    lineId: 'violet-nel',
    lineName: 'Magical Violet North-East Line',
    color: '#7d5fff',
    mode: 'express',
    progress: 0.3,
    fromStationId: 'harbourfront',
    toStationId: 'chinatown',
    nextStopName: 'Chinatown Heritage',
    etaMinutes: 3
  },
  {
    id: 'v-sg-bus-01',
    lineId: 'fluffy-bus',
    lineName: 'Double-Decker Bus #190',
    color: '#00c49f',
    mode: 'bus',
    progress: 0.7,
    fromStationId: 'toa-payoh',
    toStationId: 'orchard',
    nextStopName: 'Orchard Road',
    etaMinutes: 2
  }
];

export function getSampleRoutes(fromId: string, toId: string): RouteOption[] {
  const fromName = STATIONS[fromId]?.name || 'Origin';
  const toName = STATIONS[toId]?.name || 'Destination';

  return [
    {
      id: 'route-fastest',
      badge: 'fastest',
      badgeLabel: 'Fastest MRT Hop',
      badgeEmoji: '⭐',
      durationMinutes: 16,
      departureTime: '10:32 AM',
      arrivalTime: '10:48 AM',
      price: 'S$1.85',
      caloriesWalked: 40,
      transfers: 1,
      lines: [TRANSIT_LINES['sky-dtl'], TRANSIT_LINES['violet-nel']],
      stopsCount: 4,
      co2Saved: '540g CO₂',
      steps: [
        {
          id: 'step-1',
          mode: 'walk',
          instruction: `Tap into ${fromName} (Gantry Exit C)`,
          detail: 'Air-conditioned underground linkway with sweet kaya bakery scent',
          durationMinutes: 2,
          fromStation: fromName,
          toStation: fromName
        },
        {
          id: 'step-2',
          mode: 'train',
          instruction: 'Board Sky Blue Downtown Line (DTL)',
          detail: 'Ride 2 stops toward Marina Bay. Car 3 has priority seating & best aircon',
          durationMinutes: 6,
          lineId: 'sky-dtl',
          lineName: 'Sky Blue Downtown Line',
          lineColor: '#00baff',
          fromStation: fromName,
          toStation: 'Chinatown Heritage'
        },
        {
          id: 'step-3',
          mode: 'walk',
          instruction: 'Interchange at Chinatown Station (NEL Platform)',
          detail: 'Take the fast travel escalator down to North-East Line Platform 1',
          durationMinutes: 2,
          fromStation: 'Chinatown Heritage',
          toStation: 'Chinatown Heritage',
          isTransfer: true
        },
        {
          id: 'step-4',
          mode: 'train',
          instruction: 'Board Magical Violet North-East Line (NEL)',
          detail: `Direct express hop to ${toName}`,
          durationMinutes: 6,
          lineId: 'violet-nel',
          lineName: 'Magical Violet North-East',
          lineColor: '#7d5fff',
          fromStation: 'Chinatown Heritage',
          toStation: toName
        }
      ]
    },
    {
      id: 'route-sweetest',
      badge: 'sweetest',
      badgeLabel: 'Sweetest & Scenic',
      badgeEmoji: '🌸',
      durationMinutes: 24,
      departureTime: '10:35 AM',
      arrivalTime: '10:59 AM',
      price: 'S$2.10',
      caloriesWalked: 35,
      transfers: 1,
      lines: [TRANSIT_LINES['candy-ccl'], TRANSIT_LINES['sky-dtl']],
      stopsCount: 5,
      co2Saved: '620g CO₂',
      steps: [
        {
          id: 'step-s1',
          mode: 'walk',
          instruction: 'Stroll past Orchard Boulevard Shophouses',
          detail: 'Pick up an iced milo dinosaur or uncle ice cream sandwich',
          durationMinutes: 3,
          fromStation: fromName,
          toStation: 'Orchard Road'
        },
        {
          id: 'step-s2',
          mode: 'tram',
          instruction: 'Board Candy Pink Circle Line (CCL)',
          detail: 'Glide past Botanic Gardens and the tropical rain tree viaduct',
          durationMinutes: 11,
          lineId: 'candy-ccl',
          lineName: 'Candy Pink Circle Line',
          lineColor: '#fdb0d7',
          fromStation: 'Orchard Road',
          toStation: 'Bugis & Haji Lane'
        },
        {
          id: 'step-s3',
          mode: 'train',
          instruction: 'Board Sky Blue Downtown Line (DTL)',
          detail: `Fast connection arriving straight at ${toName}`,
          durationMinutes: 10,
          lineId: 'sky-dtl',
          lineName: 'Sky Blue Downtown Line',
          lineColor: '#00baff',
          fromStation: 'Bugis & Haji Lane',
          toStation: toName
        }
      ]
    },
    {
      id: 'route-cheapest',
      badge: 'cheapest',
      badgeLabel: 'Heartland Bus Hopper',
      badgeEmoji: '🪙',
      durationMinutes: 28,
      departureTime: '10:34 AM',
      arrivalTime: '11:02 AM',
      price: 'S$1.28',
      caloriesWalked: 75,
      transfers: 0,
      lines: [TRANSIT_LINES['fluffy-bus']],
      stopsCount: 6,
      co2Saved: '710g CO₂',
      steps: [
        {
          id: 'step-c1',
          mode: 'walk',
          instruction: 'Walk to Sheltered Bus Stop B03',
          detail: 'Green covered walkway with rain screens',
          durationMinutes: 3,
          fromStation: fromName,
          toStation: 'Sheltered Bus Stop'
        },
        {
          id: 'step-c2',
          mode: 'bus',
          instruction: 'Board Double-Decker Bus #190 (Upper Deck Front Row)',
          detail: `Panoramic scenic views of Singapore's garden city all the way to ${toName}`,
          durationMinutes: 25,
          lineId: 'fluffy-bus',
          lineName: 'Double-Decker Bus #190',
          lineColor: '#00c49f',
          fromStation: 'Sheltered Bus Stop',
          toStation: toName,
          intermediateStops: ['Toa Payoh Central', 'Orchard Road', 'Clarke Quay Riverside']
        }
      ]
    }
  ];
}
