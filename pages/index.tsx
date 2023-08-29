import React from 'react';
import Factory from '@/ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import fs from 'fs';
import Link from 'next/link';

export async function getServerSideProps() {
  return {
    props: {
      campaigns: await Factory(
        fs.readFileSync('./FACTORY_ADDRESS', 'utf-8')
      )
        .methods.getDeployedCampaigns()
        .call(),
    },
  };
}

interface Props {
  campaigns: Array<string>;
}

export default function Home({ campaigns }: Props) {
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
      <Link href='/campaigns/new'>
        <Button
          floated='right'
          content='Create Campaign'
          icon='add circle'
          primary
        />
      </Link>
      <Card.Group items={renderCampaigns()} />
    </div>
  );
}
