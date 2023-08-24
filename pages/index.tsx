import React from 'react';
import factory from '../ethereum/factory';

export async function getServerSideProps() {
  return {
    props: {
      campaigns: await factory.methods.getDeployedCampaigns().call()
    }
  }
}

export default function Home({ campaigns }) {
  console.log(campaigns);
  return <main>
    <div>hello</div>
  </main>;
}