import express from 'express';
import cors from 'cors';
import tradesRouter from './routes/trades.js';
import leaderboardRouter from './routes/leaderboard.js';
import pricesRouter from './routes/prices.js';
// import { ensureWeaviateSchema } from './weaviate.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ensure Weaviate schema is set up
// ensureWeaviateSchema().catch((err) => {
//   console.error('Failed to set up Weaviate schema:', err);
//   process.exit(1);
// });

app.use('/api/trades', tradesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/prices', pricesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`CryptoArena backend listening on port ${PORT}`);
}); 