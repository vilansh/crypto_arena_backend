import express from 'express';
import axios from 'axios';

const router = express.Router();

let cachedPrices = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

// GET /api/prices
router.get('/', async (req, res, next) => {
  try {
    const now = Date.now();
    if (cachedPrices && (now - cacheTimestamp < CACHE_DURATION)) {
      return res.json(cachedPrices);
    }
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,shiba-inu&vs_currencies=usd';
    const response = await axios.get(url);
    cachedPrices = response.data;
    cacheTimestamp = now;
    res.json(cachedPrices);
  } catch (err) {
    if (err.response) {
      // CoinGecko returned an error (e.g., 429 Too Many Requests)
      res.status(err.response.status).json({
        error: 'Failed to fetch prices from CoinGecko',
        details: err.response.data,
        status: err.response.status
      });
    } else {
      // Network or other error
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
});

export default router; 