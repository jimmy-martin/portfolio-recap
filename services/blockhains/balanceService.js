class BalanceService {
  static mergeBalances = (...balances) => balances.flat();

  static filterValuesUnder = (limit, balance) => {
    return balance.filter((item) => item.usdValue > limit);
  };

  static sort = (balance) => {
    return balance.sort((a, b) => b.usdValue - a.usdValue);
  };

  static getTotalBalanceValue = (balance) => {
    return balance.reduce((acc, cur) => acc + cur.usdValue, 0);
  };
}

module.exports = BalanceService;
