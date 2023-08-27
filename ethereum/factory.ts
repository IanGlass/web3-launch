import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

export default function createFactory(address: string) {
  return new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    address
  );
};
