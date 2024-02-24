require('dotenv').config();

const IGNORING_ADDRESS = '0x0';

const conf = {
  API_KEY: process.env.DECOMMAS_API_KEY,
  IGNORING_ADDRESS,
  EVM_ADDRESS: process.env.EVM_ADDRESS || IGNORING_ADDRESS,
  BTC_ADDRESS: process.env.BTC_ADDRESS || IGNORING_ADDRESS,
  EMAIL_RECEIVER: process.env.EMAIL_RECEIVER,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_APP_PASSWORD,
  LIMIT: process.env.LIMIT || 1,
};

module.exports = conf;
