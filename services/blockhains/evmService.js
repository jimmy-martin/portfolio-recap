const { Decommas, EvmChainName } = require('@decommas/sdk');
const conf = require('../../config/conf');
const DecommasTransformer = require('../transformers/decommasTransformer');

class EvmService {
  constructor() {
    this.decommas = new Decommas(conf.API_KEY);
  }

  getAddressTokens = async (address) => {
    try {
      const tokens = await this.decommas.address.getTokens({
        address,
        chains: [EvmChainName.MAINNET, EvmChainName.ARBITRUM],
        verified: true,
      });
      return tokens.result;
    } catch (error) {
      console.error(error);
    }
  };

  getAddressCoins = async (address) => {
    try {
      const coins = await this.decommas.address.getCoins({
        address,
        chains: [EvmChainName.MAINNET, EvmChainName.ARBITRUM],
      });
      return coins.result;
    } catch (error) {
      console.error(error);
    }
  };

  getBalance = async (address) => {
    try {
      const tokens = DecommasTransformer.transform(
        await this.getAddressTokens(address)
      );

      const coins = DecommasTransformer.transform(
        await this.getAddressCoins(address)
      );

      return [...tokens, ...coins];
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = EvmService;
