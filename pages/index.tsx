import React from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Layout from '../components/Layout';

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
    <Layout>
      <main>
        <div>
          <h3>Open Campaigns</h3>
          <Card.Group items={renderCampaigns()} />
          <Button content='Create Campaign' icon='add circle' primary />
        </div>
      </main>
    </Layout>
  );
}
