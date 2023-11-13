const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const mnemonicPhrase = process.env.MNEMONIC;
const BSCSCANAPIKEY = process.env.BSCSCANAPIKEY; 


module.exports = {
  plugins: [ 'truffle-plugin-verify'],
  api_keys: {
		bscscan: BSCSCANAPIKEY
	},
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rumsanTest: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: process.env.RUMSAN_TEST_URL
        });
      },
      network_id: process.env.RUMSAN_TEST_ID
    },
    mumbaiTest: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: process.env.MUMBAI_TEST_URL
        });
      },
      network_id: 80001
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: process.env.ROPSTEN_URL
        });
      },
      network_id: 3
    },
    binance: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: process.env.BINANCE_TEST_URL
        });
      },
      network_id: 97
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.0" // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};
