const web3 = require('./web3');
const CampaignFactory = require('./build/CampaignFactory.json');
const fs = require('fs');
const path = require('path');

export default new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  fs.readFileSync(path.resolve(__dirname, '../', 'FACTORY_ADDRESS'), 'utf-8')
);
