import { applets } from '@web-applets/sdk';

const self = applets.register();

// Existing handler (already implemented)
self.setActionHandler('get_price', async ({ id }) => {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
    const json = await res.json();
    const price = json[id]?.usd;

    if (price !== undefined) {
      self.data = { id, price };
    } else {
      self.data = { error: `No price found for ID "${id}".` };
    }
  } catch (err) {
    self.data = { error: `Error fetching price: ${err}` };
  }
});

// NEW HANDLERS

self.setActionHandler('get_top_gainers', async () => {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=5');
  const json = await res.json();
  self.data = { top_gainers: json.map(({ id, symbol, price_change_percentage_24h }) => ({ id, symbol, change: price_change_percentage_24h })) };
});

self.setActionHandler('get_top_losers', async () => {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_asc&per_page=5');
  const json = await res.json();
  self.data = { top_losers: json.map(({ id, symbol, price_change_percentage_24h }) => ({ id, symbol, change: price_change_percentage_24h })) };
});

self.setActionHandler('get_global_market_data', async () => {
  const res = await fetch('https://api.coingecko.com/api/v3/global');
  const json = await res.json();
  self.data = json.data;
});

self.setActionHandler('get_gas_fees', async () => {
  const res = await fetch('https://ethgas.watch/api/gas');
  const json = await res.json();
  self.data = json.blockPrices?.[0]?.estimatedPrices || { error: 'No gas data available' };
});

self.setActionHandler('get_protocol_tvl', async ({ protocol }) => {
  const res = await fetch(`https://api.llama.fi/protocol/${protocol}`);
  const json = await res.json();
  self.data = json;
});

self.setActionHandler('get_token_tvl', async ({ tokenAddress }) => {
  const res = await fetch(`https://api.llama.fi/tvl/token/${tokenAddress}`);
  const json = await res.json();
  self.data = json;
});

self.setActionHandler('get_token_supply', async ({ id }) => {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
  const json = await res.json();
  self.data = { id, supply: json.market_data?.circulating_supply };
});

self.setActionHandler('get_token_marketcap', async ({ id }) => {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
  const json = await res.json();
  self.data = { id, market_cap: json.market_data?.market_cap?.usd };
});

self.setActionHandler('get_volume_traded', async ({ id }) => {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
  const json = await res.json();
  self.data = { id, volume: json.market_data?.total_volume?.usd };
});

self.setActionHandler('get_price_chart', async ({ id }) => {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`);
  const json = await res.json();
  self.data = { id, prices: json.prices };
});

self.setActionHandler('get_latest_news', async () => {
  const res = await fetch('https://cryptopanic.com/api/v1/posts/?auth_token=demo&public=true');
  const json = await res.json();
  self.data = { headlines: json.results.map(r => ({ title: r.title, url: r.url })) };
});

self.setActionHandler('get_trending_searches', async () => {
  const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
  const json = await res.json();
  self.data = json;
});

// Shared ondata handler (temporary UI)
self.ondata = () => {
  const display = document.getElementById('price-display');
  if (!display) return;
  display.textContent = JSON.stringify(self.data, null, 2);
};
