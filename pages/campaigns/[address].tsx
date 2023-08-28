import React from 'react';
import { useRouter } from 'next/router';
import createCampaign from '@/ethereum/campaign';
import { Card, Grid } from 'semantic-ui-react';
import web3 from '@/ethereum/web3';
import ContributeForm from '@/components/ContributeForm';

export async function getServerSideProps(props) {
  const summary = await createCampaign(props.query.address)
    .methods.getSummary()
    .call();
  return {
    props: {
      summary: {
        minimumContribution: summary[0],
        balance: web3.utils.fromWei(summary[1], 'ether'),
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4],
      },
    },
  };
}

export default function CampaignDetails({ summary }) {
  const router = useRouter();
  const { address } = router.query;

  const renderDetails = () => {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
    } = summary;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager creatde this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to become a contributor',
      },
      {
        header: requestsCount,
        meta: ' Number of requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers',
      },
      {
        header: approversCount,
        meta: ' Number of approvers',
        description:
          'Number of people who have already donated to this campaign',
      },
      {
        header: balance,
        meta: 'Campaign balance (Ether)',
        description:
          'The balance is how much money this campaign has left to spend',
      },
    ];
    return items;
  };

  return (
    <>
      <h3>Campaign Details</h3>
      <Grid>
        <Grid.Column width={10}>
          <Card.Group items={renderDetails()} />
        </Grid.Column>
        <Grid.Column width={6}>
          <ContributeForm address={address} />
        </Grid.Column>
      </Grid>
    </>
  );
}
