import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';
import Campaign from '@/ethereum/campaign';

export async function getServerSideProps(props) {
  const summary = await Campaign(props.query.address)
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
export default function Requests() {
  const router = useRouter();
  const { address } = router.query;

  return (
    <>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button primary>New Request</Button>
      </Link>
    </>
  );
}
