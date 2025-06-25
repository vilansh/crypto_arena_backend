import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
  scheme: 'https',
  host: 'rriibylrryagvdvxdosoqa.c0.asia-southeast1.gcp.weaviate.cloud',
  apiKey: new weaviate.ApiKey('SVU4UmZVaWwwWEJEbnAvRl8wYllMaDQ3dUlWeEtOSGZwQWxqalg2VXF5ZjJaYWRwaDhNNzhxa2UxajRvPV92MjAw'),
});

const tradeClass = {
  class: 'Trade',
  description: "A record of a user's trade",
  properties: [
    { name: 'wallet', dataType: ['text'], description: 'Wallet address' },
    { name: 'token', dataType: ['text'], description: 'Token symbol' },
    { name: 'side', dataType: ['text'], description: 'buy or sell' },
    { name: 'amount', dataType: ['number'], description: 'Amount traded' },
    { name: 'price', dataType: ['number'], description: 'Price at transaction' },
    { name: 'timestamp', dataType: ['date'], description: 'Trade timestamp' }
  ],
  vectorizer: 'text2vec-openai',
  moduleConfig: {
    'generative-openai': {}
  }
};

const portfolioSnapshotClass = {
  class: 'PortfolioSnapshot',
  description: "A snapshot of a user's portfolio",
  properties: [
    { name: 'wallet', dataType: ['text'], description: 'Wallet address' },
    { name: 'snapshot', dataType: ['text'], description: 'Serialized portfolio data' },
    { name: 'vector', dataType: ['number[]'], description: 'Vector embedding of portfolio' },
    { name: 'timestamp', dataType: ['date'], description: 'Snapshot timestamp' }
  ],
  vectorizer: 'text2vec-openai',
  moduleConfig: {
    'generative-openai': {}
  }
};

async function createSchema() {
  try {
    await client.schema.classCreator().withClass(tradeClass).do();
    console.log('Trade class created successfully.');
    await client.schema.classCreator().withClass(portfolioSnapshotClass).do();
    console.log('PortfolioSnapshot class created successfully.');
  } catch (error) {
    console.error('Error creating schema:', error);
  }
}

createSchema(); 