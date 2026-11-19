/**
 * Singapore LTA Bus Arrival API Endpoint
 * GET /api/bus-arrival?BusStopCode=04121&ServiceNo=7
 *
 * Integrates with Singapore Land Transport Authority (LTA) DataMall v3 BusArrival API:
 * https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode={code}
 *
 * Refreshes every 20 seconds.
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Cache-Control', 'public, max-age=20, s-maxage=20'); // Cache for 20 seconds

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  // Extract query parameters (support both PascalCase and camelCase)
  const busStopCode = (req.query.BusStopCode || req.query.busStopCode || req.query.code || '').trim();
  const serviceNo = (req.query.ServiceNo || req.query.serviceNo || '').trim();

  if (!busStopCode) {
    return res.status(400).json({
      error: 'BusStopCode is required',
      example: '/api/bus-arrival?BusStopCode=04121&ServiceNo=7',
    });
  }

  const accountKey = (
    process.env.LTA_ACCOUNT_KEY ||
    req.headers['accountkey'] ||
    req.headers['account-key'] ||
    req.query.AccountKey ||
    req.query.accountKey ||
    ''
  ).trim();

  // If LTA_ACCOUNT_KEY is configured, call the live LTA DataMall API
  if (accountKey && accountKey.trim() !== '') {
    try {
      const url = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
      url.searchParams.set('BusStopCode', busStopCode);
      if (serviceNo) {
        url.searchParams.set('ServiceNo', serviceNo);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          AccountKey: accountKey.trim(),
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          error: `LTA DataMall API returned status ${response.status}`,
          details: errorText,
        });
      }

      const data = await response.json();
      return res.status(200).json({
        source: 'lta-datamall-live',
        ...data,
      });
    } catch (err) {
      return res.status(502).json({
        error: 'Failed to connect to LTA DataMall service',
        message: err.message,
      });
    }
  }

  // Fallback when LTA_ACCOUNT_KEY is not yet configured in environment variables
  // Generates dynamic, realistic LTA v3 format data based on current timestamp
  const now = new Date();
  const generateArrival = (minutesAhead, type = 'DD', load = 'SEA', origin = '95009', dest = '95009') => {
    const arrivalTime = new Date(now.getTime() + minutesAhead * 60000);
    return {
      OriginCode: origin,
      DestinationCode: dest,
      EstimatedArrival: arrivalTime.toISOString(),
      Latitude: '1.3592',
      Longitude: '103.9893',
      VisitNumber: '1',
      Load: load, // SEA = Seats Available, SDA = Standing Available, LSD = Limited Standing
      Feature: 'WAB', // Wheelchair Accessible Bus
      Type: type, // SD = Single Deck, DD = Double Deck, BD = Bendy
    };
  };

  const defaultServices = [
    {
      ServiceNo: '36',
      Operator: 'GAS', // Go-Ahead Singapore operates Service 36 Changi Express loop
      NextBus: generateArrival(2, 'DD', 'SEA', '95009', '95009'),
      NextBus2: generateArrival(9, 'DD', 'SEA', '95009', '95009'),
      NextBus3: generateArrival(18, 'SD', 'SDA', '95009', '95009'),
    },
    {
      ServiceNo: '7',
      Operator: 'SBST',
      NextBus: generateArrival(3, 'DD', 'SEA', '16009', '17009'),
      NextBus2: generateArrival(10, 'SD', 'SDA', '16009', '17009'),
      NextBus3: generateArrival(19, 'DD', 'SEA', '16009', '17009'),
    },
    {
      ServiceNo: '14',
      Operator: 'SBST',
      NextBus: generateArrival(5, 'DD', 'SDA', '16009', '17009'),
      NextBus2: generateArrival(12, 'DD', 'SEA', '16009', '17009'),
      NextBus3: generateArrival(23, 'SD', 'SEA', '16009', '17009'),
    },
    {
      ServiceNo: '190',
      Operator: 'SMRT',
      NextBus: generateArrival(1, 'DD', 'SDA', '44009', '03222'),
      NextBus2: generateArrival(8, 'DD', 'SEA', '44009', '03222'),
      NextBus3: generateArrival(15, 'DD', 'SEA', '44009', '03222'),
    },
    {
      ServiceNo: '197',
      Operator: 'SBST',
      NextBus: generateArrival(6, 'SD', 'SEA', '52009', '05019'),
      NextBus2: generateArrival(14, 'DD', 'SEA', '52009', '05019'),
      NextBus3: generateArrival(25, 'SD', 'LSD', '52009', '05019'),
    },
  ];

  const filteredServices = serviceNo
    ? defaultServices.filter((s) => s.ServiceNo === serviceNo)
    : defaultServices;

  return res.status(200).json({
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/$metadata#BusArrival',
    BusStopCode: busStopCode,
    Services: filteredServices.length > 0 ? filteredServices : [
      {
        ServiceNo: serviceNo,
        Operator: 'SBST',
        NextBus: generateArrival(3, 'DD', 'SEA'),
        NextBus2: generateArrival(11, 'DD', 'SDA'),
        NextBus3: generateArrival(21, 'SD', 'SEA'),
      },
    ],
    source: 'simulated-preview',
    note: 'LTA_ACCOUNT_KEY is not yet configured. Showing simulated real-time data until key is added to Vercel environment variables.',
  });
}
