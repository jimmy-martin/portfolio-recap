const EvmService = require('./evmService');
const BitcoinService = require('./bitcoinService');
const BitgetService = require('./bitgetService');
const conf = require('../../config/conf');

class BalanceService {
  static getAllBalances = async () => {
    const evmService = new EvmService();
    const bitcoinService = new BitcoinService();
    const bitgetService = new BitgetService();

    let btcBalance = [];
    if (conf.BTC_ADDRESS !== conf.IGNORING_ADDRESS) {
      btcBalance = await bitcoinService.getBalance(conf.BTC_ADDRESS);
    }

    let evmBalance = [];
    if (conf.EVM_ADDRESS !== conf.IGNORING_ADDRESS) {
      evmBalance = await evmService.getBalance(conf.EVM_ADDRESS);
    }

    let bitgetBalance = [];
    if (conf.BITGET_API_KEY !== conf.IGNORING_ADDRESS) {
      bitgetBalance = await bitgetService.getBalance(conf.BITGET_API_KEY);
    }

    return this.mergeBalances(btcBalance, evmBalance, bitgetBalance);
  };

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
