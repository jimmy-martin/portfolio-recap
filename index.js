const conf = require('./config/conf');
const EvmService = require('./services/blockhains/evmService');
const Converter = require('./services/converter');
const EmailService = require('./services/emailService');

const main = async () => {
  const evmService = new EvmService();

  const balance = await evmService.getBalance(conf.EVM_ADDRESS);

  const sortedBalance = balance.sort((a, b) => b.usdValue - a.usdValue);

  const totalBalanceUsd = Converter.getTotalBalanceValue(balance);
  const totalBalanceEur = Converter.getEurValue(totalBalanceUsd);

  const emailService = new EmailService();

  emailService.sendEmail({
    totalBalanceUsd,
    totalBalanceEur,
    balance: sortedBalance,
  });
};

main();
