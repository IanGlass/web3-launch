// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum));
        deployedCampaigns.push(payable(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address payable[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request  {
        // Explain to approvers why the request is being made
        string description;
        // How much the manager wants to spend
        uint value;
        // The address of the vendor to receive the funds
        address recipient;
        // If the request has been processed
        bool complete;
        // Used to determine when a Request has enough votes to be approved
        uint approvalCount;
        // Which contributors have approved the request
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    // List of contributors to the campaign who can also vote to approve requests made by managers
    mapping(address => bool) public approvers;
    // List of requests that the manager has made to spend funds to different vendors
    Request[] public requests;
    // The total number of approvers for a campaign. Used to determine if an individual request has enough approvals
    uint public approversCount;

    modifier onlyManager() {
        require(msg.sender == manager, "Only a manager can call this function");
        _;
    }

    constructor(uint minimum) {
        manager = tx.origin;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Must contribute a minimum amount");

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public onlyManager {
        Request storage newRequest = requests.push(); 
        newRequest.description = description;
        newRequest.value= value;
        newRequest.recipient= recipient;
        newRequest.complete= false;
        newRequest.approvalCount= 0;
    }

    function approveRequest(uint requestIndex) public {
        Request storage request = requests[requestIndex];

        // Approver must be a contributer of the campaign
        require(approvers[msg.sender], "Must be a contributor of the Campaign");
        // Approvers should only be able to vote once per request
        require(!request.approvals[msg.sender], "Already approved this request");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestIndex) public onlyManager {
        Request storage request = requests[requestIndex];

        // Ensure request has not already been finalized
        require(!request.complete);

        // Ensure request has at least 50% approvals of all Campaign contributors
        require(request.approvalCount > (approversCount / 2));

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}







