const Converter = require('../converter');

class BlockchainInfoTransformer {
  static transform = (rawData, prices) => {
    const transformed = Object.entries(rawData).map(([address, item]) => {
      const amount = Converter.getAmountFromDecimals(item.final_balance, 8);
      const usdValue = amount * prices.usd;
      const eurValue = amount * prices.eur;

      return {
        chain: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        actualPrice: prices.usd,
        amount,
        usdValue: parseFloat(usdValue),
        eurValue: parseFloat(eurValue),
      };
    });

    return this.#groupBalances(transformed);
  };

  static #groupBalances = (balances) => {
    return balances.reduce((acc, item) => {
      const existingItem = acc.find(
        (accItem) => accItem.symbol === item.symbol
      );

      if (existingItem) {
        existingItem.amount += item.amount;
        existingItem.usdValue += item.usdValue;
        existingItem.eurValue += item.eurValue;
      } else {
        acc.push(item);
      }

      return acc;
    }, []);
  };
}

module.exports = BlockchainInfoTransformer;
