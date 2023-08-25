import React from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';

export async function getServerSideProps() {
  return {
    props: {
      campaigns: await factory.methods.getDeployedCampaigns().call(),
    },
  };
}

export default function Home({ campaigns }) {
  const renderCampaigns = () =>
    campaigns.map((address) => ({
      header: address,
      description: <a>View Campaign</a>,
      meta: '',
      fluid: true,
    }));

  return (
    <div>
      <h3>Open Campaigns</h3>
      <Button
        floated='right'
        content='Create Campaign'
        icon='add circle'
        primary
      />
      <Card.Group items={renderCampaigns()} />
    </div>
  );
}
