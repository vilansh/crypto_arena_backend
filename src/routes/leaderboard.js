import express from 'express';
import axios from 'axios';

const router = express.Router();

const WEAVIATE_URL = process.env.WEAVIATE_URL;
const WEAVIATE_API_KEY = process.env.WEAVIATE_API_KEY;

// GET /api/leaderboard
router.get('/', async (req, res, next) => {
  try {
    const graphqlEndpoint = `${WEAVIATE_URL.replace(/^https?:\/\//, 'https://')}/v1/graphql`;
    const query = {
      query: `{
        Get {
          PortfolioSnapshot {
            wallet
            snapshot
            vector
            timestamp
          }
        }
      }`
    };
    const headers = {
      'Content-Type': 'application/json',
      'X-API-KEY': WEAVIATE_API_KEY
    };
    const response = await axios.post(graphqlEndpoint, query, { headers });
    const snapshots = response.data.data.Get.PortfolioSnapshot || [];

    // Aggregate by wallet, take the latest snapshot per wallet
    const latestByWallet = {};
    for (const snap of snapshots) {
      if (!latestByWallet[snap.wallet] || new Date(snap.timestamp) > new Date(latestByWallet[snap.wallet].timestamp)) {
        latestByWallet[snap.wallet] = snap;
      }
    }

    // Mock calculation for value, profit, winRate
    const leaderboard = Object.values(latestByWallet).map(snap => ({
      wallet: snap.wallet,
      value: Number(snap.vector?.[0] || 0),
      profit: Number(snap.vector?.[1] || 0),
      winRate: Number(snap.vector?.[2] || 0),
    }));

    leaderboard.sort((a, b) => b.value - a.value);
    res.json(leaderboard);
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).json({
        error: 'Failed to fetch leaderboard from Weaviate',
        details: err.response.data,
        status: err.response.status
      });
    } else {
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
});

export default router; 