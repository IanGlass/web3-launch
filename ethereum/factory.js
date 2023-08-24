import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
import fs from 'fs';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  fs.readFileSync('./FACTORY_ADDRESS', 'utf-8')
);

export default instance;
