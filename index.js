const conf = require('./config/conf');
const Converter = require('./services/converter');
const EmailService = require('./services/emailService');
const BalanceService = require('./services/blockhains/balanceService');

const main = async () => {
  let balance = await BalanceService.getAllBalances();
  balance = BalanceService.filterValuesUnder(conf.LIMIT, balance);

  const totalBalanceUsd = BalanceService.getTotalBalanceValue(balance);
  balance = BalanceService.sort(balance);
  balance = BalanceService.setPercentagesInBalance(
    balance,
    totalBalanceUsd,
  );

  const emailService = new EmailService();

  emailService.sendEmail({
    totalBalanceUsd,
    totalBalanceEur: Converter.getEurValue(totalBalanceUsd),
    balance,
  });
};

main();
