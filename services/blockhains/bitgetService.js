const conf = require('../../config/conf');
const crypto = require('crypto');
const BitgetTransformer = require('../transformers/bitgetTransformer');

class BitgetService {
  getBalance = async () => {
    const tokenList = await this.getTokenList();

    const tokenBalances = [];
    for (let token of tokenList.data) {
      if (token.coin === 'USDT') {
        tokenBalances.push({
          symbol: 'USDT',
          ...token,
        });
        continue;
      }

      const info = await this.getCoinInfo(token.coin);
      const data = info.data[0];
      tokenBalances.push({
        ...token,
        ...data,
      });
    }

    return BitgetTransformer.transform(tokenBalances);
  };

  getCoinInfo = (coin) => {
    return this.fetchData(`/api/v2/spot/market/tickers?symbol=${coin}USDT`);
  };

  getTokenList = () => {
    return this.fetchData('/api/v2/spot/account/assets', true);
  };

  /**
   * Générer une signature HMAC SHA256 codée en Base64.
   * La signature est utilisée pour authentifier les requêtes Bitget.
   *
   * @param {string} method - La méthode HTTP de la requête (GET, POST, etc.).
   * @param {string} requestPath - Le chemin de la requête.
   * @param {number} timestamp - Le timestamp de la requête.
   * @returns {string} La signature codée en Base64.
   */
  getSignature = (method, requestPath, timestamp) => {
    const contentToSign = `${timestamp}${method.toUpperCase()}${requestPath}`;
    const hmac = crypto.createHmac('sha256', conf.BITGET_SECRET_KEY);
    return hmac.update(contentToSign).digest('base64');
  };

  getHeaders = (endpoint) => {
    const timestamp = Date.now();
    const signature = this.getSignature('GET', endpoint, timestamp);
    return {
      'ACCESS-KEY': conf.BITGET_API_KEY,
      'ACCESS-SIGN': signature,
      'ACCESS-PASSPHRASE': conf.BITGET_PASSPHRASE,
      'ACCESS-TIMESTAMP': timestamp,
    };
  };

  fetchData = async (endpoint, isAuthenticated = false) => {
    try {
      const url = `https://api.bitget.com${endpoint}`;
      const response = await fetch(url, {
        headers: isAuthenticated ? this.getHeaders(endpoint) : {},
      });
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = BitgetService;
