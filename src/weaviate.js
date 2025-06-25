import weaviate from 'weaviate-client';
import 'dotenv/config';
import fetch from 'node-fetch';
import axios from 'axios';

const weaviateURL = process.env.WEAVIATE_URL;
const weaviateApiKey = process.env.WEAVIATE_API_KEY;

let client = null;

export async function getWeaviateClient() {
  if (!client) {
    client = await weaviate.connectToWeaviateCloud(weaviateURL, {
      authCredentials: new weaviate.ApiKey(weaviateApiKey),
    });
  }
  const ready = await client.isReady();
  console.log('Weaviate client ready?', ready);
  return client;
}

const tradeClass = {
  class: "Trade",
  description: "A record of a user's trade",
  properties: [
    { name: "wallet", dataType: ["text"], description: "Wallet address" },
    { name: "token", dataType: ["text"], description: "Token symbol" },
    { name: "side", dataType: ["text"], description: "buy or sell" },
    { name: "amount", dataType: ["number"], description: "Amount traded" },
    { name: "price", dataType: ["number"], description: "Price at transaction" },
    { name: "timestamp", dataType: ["date"], description: "Trade timestamp" }
  ]
};

const portfolioSnapshotClass = {
  class: "PortfolioSnapshot",
  description: "A snapshot of a user's portfolio",
  properties: [
    { name: "wallet", dataType: ["text"], description: "Wallet address" },
    { name: "snapshot", dataType: ["text"], description: "Serialized portfolio data" },
    { name: "vector", dataType: ["number[]"], description: "Vector embedding of portfolio" },
    { name: "timestamp", dataType: ["date"], description: "Snapshot timestamp" }
  ]
};

// export async function ensureWeaviateSchema() {
// const client = await getWeaviateClient();
//   const schemaRes = await client.schema.getter().do();
//   const classes = schemaRes.classes.map((c) => c.class);
//   if (!classes.includes('Trade')) {
//     await client.schema.classCreator().withClass(tradeClass).do();
//   }
//   if (!classes.includes('PortfolioSnapshot')) {
//     await client.schema.classCreator().withClass(portfolioSnapshotClass).do();
//   }
// }

// ...schema setup logic can use: const client = await getWeaviateClient();