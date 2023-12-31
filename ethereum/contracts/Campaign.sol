pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address [] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request  {
        // Explain to contributors why the request is being made
        string description;
        // How much the manager wants to spend
        uint amount;
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
    mapping(address => bool) public contributors;
    // List of requests that the manager has made to spend funds to different vendors
    Request[] public requests;
    // The total number of contributors for a campaign. Used to determine if an individual request has enough approvals
    uint public contributorsCount;

    modifier onlyManager() {
        require(msg.sender == manager, "Only a manager can call this function");
        _;
    }

    constructor(uint minimum) public {
        manager = tx.origin;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Must contribute a minimum amount");

        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function createRequest(string memory description, uint amount, address recipient) public onlyManager {
        Request memory newRequest = Request({
           description: description,
           amount: amount,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint requestIndex) public {
        Request storage request = requests[requestIndex];

        // Approver must be a contributer of the campaign
        require(contributors[msg.sender], "Must be a contributor of the Campaign");
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
        require(request.approvalCount > (contributorsCount / 2));

        request.recipient.transfer(request.amount);
        request.complete = true;
    }

    function getSummary() public view returns(
        uint,
        uint,
        uint,
        uint,
        address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributorsCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}







