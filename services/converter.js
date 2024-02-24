class Converter {
  static getAmountFromDecimals(amount, decimals) {
    return amount / 10 ** decimals;
  }

  static getUsdValue(amount, actualPrice) {
    return amount * actualPrice;
  }

  static getEurValue(usdValue) {
    const rate = 0.93;
    return usdValue * rate;
  }
}

module.exports = Converter;
