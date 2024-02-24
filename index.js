const conf = require('./config/conf');
const BitcoinService = require('./services/blockhains/bitcoinService');
const EvmService = require('./services/blockhains/evmService');
const Converter = require('./services/converter');
const EmailService = require('./services/emailService');
const BalanceService = require('./services/blockhains/balanceService');

const main = async () => {
  const evmService = new EvmService();
  const bitcoinService = new BitcoinService();

  const btcBalance = await bitcoinService.getBalance(conf.BTC_ADDRESS);
  const evmBalance = await evmService.getBalance(conf.EVM_ADDRESS);

  let balance = BalanceService.mergeBalances(btcBalance, evmBalance);
  balance = BalanceService.filterValuesUnder(1, balance);

  const totalBalanceUsd = BalanceService.getTotalBalanceValue(balance);
  const totalBalanceEur = Converter.getEurValue(totalBalanceUsd);

  const emailService = new EmailService();

  emailService.sendEmail({
    totalBalanceUsd,
    totalBalanceEur,
    balance: BalanceService.sort(balance),
  });
};

main();
