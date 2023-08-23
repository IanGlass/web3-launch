const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

const web3 = new Web3(ganache.provider());

describe('Campaign Contract', () => {
  let accounts;
  let factory;
  let campaignAddress;
  let campaign;
  let managerAccount;
  let contributorAccount;
  let recipientAccount;
  const minimumContribution = 100;

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    managerAccount = accounts[0];
    contributorAccount = accounts[1];
    recipientAccount = accounts[2];

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: compiledFactory.bytecode })
      .send({
        from: managerAccount,
        gas: '1000000'
      });

    // Create a single campaign contract with a 100 minimumContribution using the factory
    await factory.methods.createCampaign(minimumContribution.toString()).send({
      from: managerAccount,
      gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    // Create an interface to the deployed contract
    campaign = await new web3.eth.Contract(
      JSON.parse(compiledCampaign.interface),
      campaignAddress
    );
  });

  it('deploys a factory and a campaign', async () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, managerAccount);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: contributorAccount
    });

    const isContributor = await campaign.methods.approvers(contributorAccount).call();
    assert(isContributor);
  });

  it('throw error for contribution below minimum', async () => {
    assert.rejects(campaign.methods.contribute().send({
      value: (minimumContribution - 1).toString(),
      from: contributorAccount
    }));
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest(
      'Buy batteries',
      (minimumContribution/2).toString(),
      recipientAccount
    ).send({
      from: managerAccount,
      gas: '1000000'
    });

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, 'Buy batteries');
  });

  it('processes requests end to end', async () => {
    const recipientStartingBalance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(recipientAccount), 'ether'));
    await campaign.methods.contribute().send({
      from: contributorAccount,
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods.createRequest(
      'Buy batteries',
      web3.utils.toWei('5', 'ether'),
      recipientAccount
    ).send({
      from: managerAccount,
      gas: '1000000'
    });

    await campaign.methods.approveRequest(0).send({
      from: contributorAccount,
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: managerAccount,
      gas: '1000000'
    });

    const balance = parseFloat(web3.utils.fromWei(await web3.eth.getBalance(recipientAccount), 'ether'));
    assert(balance >= recipientStartingBalance + 5);
  });
});