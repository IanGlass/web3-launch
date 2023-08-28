import React from 'react';
import createFactory from '@/ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import fs from 'fs';
import { useRouter } from 'next/router';
import Link from 'next/link';

export async function getServerSideProps() {
  return {
    props: {
      campaigns: await createFactory(fs.readFileSync('./FACTORY_ADDRESS', 'utf-8')).methods.getDeployedCampaigns().call(),
    },
  };
}

export default function Home({ campaigns }) {
  const router = useRouter();
  const renderCampaigns = () =>
    campaigns.map((address) => ({
      header: address,
      description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
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
        onClick={() => router.push('/campaigns/new')}
        primary
      />
      <Card.Group items={renderCampaigns()} />
    </div>
  );
};