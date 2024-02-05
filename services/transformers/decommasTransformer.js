const Converter = require('../converter');

class DecommasTransformer {
  static transform(rawData) {
    const transformed = rawData.map((data) => {
      const amount = Converter.getAmountFromDecimals(
        data.amount,
        data.decimals
      );
      const usdValue = Converter.getUsdValue(amount, data.actualPrice);
      const eurValue = Converter.getEurValue(usdValue);

      const chain = data.chainName === 'mainnet' ? 'ethereum' : data.chainName;

      return {
        chain,
        symbol: data.symbol,
        name: data.name,
        actualPrice: parseFloat(data.actualPrice),
        amount,
        usdValue: parseFloat(usdValue),
        eurValue: parseFloat(eurValue),
      };
    });

    return transformed;
  }
}

module.exports = DecommasTransformer;
