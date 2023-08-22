pragma solidity ^0.4.17;

import './Campaign.sol';

contract Factory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public {
        address newCampaign = new Campaign(minimumContribution);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}