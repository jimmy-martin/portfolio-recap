const Converter = require('../converter');

class BitgetTransformer {
  static transform = (rawData) => {
    return rawData.map((data) => {
      const amount = data.available;
      const usdValue = amount * data.lastPr;
      const eurValue = Converter.getEurValue(usdValue);

      return {
        chain: 'bitget',
        symbol: data.coin,
        name: data.coin,
        actualPrice: parseFloat(data.lastPr),
        amount,
        usdValue: parseFloat(usdValue),
        eurValue: parseFloat(eurValue),
      };
    });
  };
}

module.exports = BitgetTransformer;
