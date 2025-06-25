# CryptoArena Backend

This is the backend for the CryptoArena trading simulator DApp.

## Tech Stack
- Node.js
- Express
- Weaviate (vector DB)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm run dev
   ```

## Project Structure
- `src/` - Source code
  - `index.js` - Entry point
  - `weaviate.js` - Weaviate client and schema setup
  - `routes/` - Express route handlers

## Environment
- Make sure a Weaviate instance is running and accessible.
- Configure the Weaviate URL in `src/weaviate.js` if needed. 