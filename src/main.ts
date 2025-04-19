import { applets } from '@web-applets/sdk';

const self = applets.register();

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

self.ondata = () => {
  const display = document.getElementById('price-display');
  if (!display) return;

  const { id, price, error } = self.data;
  if (error) {
    display.textContent = error;
  } else if (id && price !== undefined) {
    display.textContent = `${id}: $${price}`;
  }
};
