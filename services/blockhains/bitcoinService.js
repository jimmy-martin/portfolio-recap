const BlockchainInfoTransformer = require('../transformers/blockchainInfoTransformer');

class BitcoinService {
  getBalance = async (address) => {
    try {
      const response = await fetch(
        `https://blockchain.info/balance?active=${address}`
      );
      const data = await response.json();
      const prices = await this.getBtcPrices();

      return BlockchainInfoTransformer.transform(data, prices);
    } catch (error) {
      console.error(error);
    }
  };

  getBtcPrices = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur'
      );
      const data = await response.json();

      return {
        usd: data.bitcoin.usd,
        eur: data.bitcoin.eur,
      };
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = BitcoinService;
