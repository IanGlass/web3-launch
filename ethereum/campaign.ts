import web3 from "./web3";
import CampaignContract from "./build/Campaign.json";

export default function Campaign(address: string) {
  return new web3.eth.Contract(
    JSON.parse(CampaignContract.interface),
    address
  );
};
