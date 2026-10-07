/**
 * Health Check API Endpoint
 * GET /api/health
 *
 * Used to monitor if the API routes are working and check environment configuration.
 */

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ltaKeyPresent = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim() !== '');

  return res.status(200).json({
    status: 'ok',
    service: 'Sky & Candy SG Transit API',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: {
      ltaAccountKeyConfigured: ltaKeyPresent,
      nodeVersion: process.version,
    },
    endpoints: [
      {
        path: '/api/health',
        method: 'GET',
        description: 'Health check and API status',
      },
      {
        path: '/api/bus-arrival',
        method: 'GET',
        description: 'Singapore LTA Bus Arrival real-time endpoint',
        params: {
          BusStopCode: '5-digit bus stop code (required, e.g. 04121)',
          ServiceNo: 'Bus service number (optional, e.g. 7)',
        },
      },
      {
        path: '/api/service-alerts',
        method: 'GET',
        description: 'LTA real-time service disruptions, maintenance, and diversion alerts',
        params: {
          BusStopCode: '5-digit bus stop code (optional)',
          ServiceNo: 'Bus service number (optional)',
        },
      },
    ],
  });
}
