import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '@/ethereum/campaign';
import { map } from 'async';
import RequestRow from '@/components/RequestRow';

export async function getServerSideProps(props) {
  const requestCount = await Campaign(props.query.address)
    .methods.getRequestsCount()
    .call();

  const requests = await map(
    Array.from({ length: requestCount }, (_, index) => index),
    async (index) =>
      await Campaign(props.query.address).methods.requests(index).call()
  );

  const approversCount = await Campaign(props.query.address)
    .methods.approversCount()
    .call();

  return {
    props: {
      approversCount,
      requests: requests.map((request) => ({
        description: request.description,
        amount: request.value,
        recipient: request.recipient,
        complete: request.complete,
        approvalCount: parseInt(request.approvalCount),
      })),
    },
  };
}
export default function Requests({ requests, approversCount }) {
  const { Row, Header, HeaderCell, Body } = Table;
  const router = useRouter();
  const { address } = router.query;

  return (
    <>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button style={{ marginBottom: '10px' }} floated='right' primary>
          New request
        </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {requests.map((request, index: number) => (
            <RequestRow
              key={index}
              id={index}
              request={request}
              address={address}
              approversCount={approversCount}
            />
          ))}
        </Body>
      </Table>
      <div>Found {requests.length} requests</div>
    </>
  );
}
