const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

const provider = new HDWalletProvider(
  process.env.METAMASK_MNEMONIC,
  // remember to change this to your own phrase!
  process.env.INFURA_NETWORK
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1400000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  fs.writeFileSync(path.resolve(__dirname, '../', 'FACTORY_ADDRESS'), result.options.address);
  provider.engine.stop();
};
deploy();
