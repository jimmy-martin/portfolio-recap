const { Decommas, EvmChainName } = require('@decommas/sdk');
const conf = require('../../config/conf');
const DecommasTransformer = require('../transformers/decommasTransformer');

const SUPPORTED_EVM_CHAINS = [
  EvmChainName.MAINNET, // ETHEREUM
  EvmChainName.ARBITRUM,
];

class EvmService {
  constructor() {
    this.decommas = new Decommas(conf.API_KEY);
  }

  getAddressTokens = async (address) => {
    try {
      const tokens = await this.decommas.address.getTokens({
        address,
        chains: SUPPORTED_EVM_CHAINS,
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
        chains: SUPPORTED_EVM_CHAINS,
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
