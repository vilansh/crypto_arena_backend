import express from 'express';
import { getWeaviateClient } from '../weaviate.js';

const router = express.Router();

// POST /api/trades
router.post('/', async (req, res, next) => {
  try {
    const { wallet, token, side, amount, price, timestamp } = req.body;
    if (!wallet || !token || !['buy', 'sell'].includes(side) || typeof amount !== 'number' || typeof price !== 'number' || !timestamp) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    const client = await getWeaviateClient();
    await client.data.creator()
      .withClassName('Trade')
      .withProperties({ wallet, token, side, amount, price, timestamp })
      .do();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/trades/:wallet
router.get('/:wallet', async (req, res, next) => {
  try {
    const { wallet } = req.params;
    const client = await getWeaviateClient();
    const trades = await client.graphql.get()
      .withClassName('Trade')
      .withFields('wallet token side amount price timestamp')
      .withWhere({
        path: ['wallet'],
        operator: 'Equal',
        valueString: wallet,
      })
      .do();
    const results = trades.data.Get.Trade || [];
    res.json(results);
  } catch (err) {
    next(err);
  }
});

export default router; 