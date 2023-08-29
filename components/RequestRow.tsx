import web3 from '@/ethereum/web3';
import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '@/ethereum/campaign';
import { useRouter } from 'next/router';
import Request from '@/types/Request';

interface Props {
  id: number;
  request: Request;
  address: string;
  contributorsCount: number;
}

export default function RequestRow({ id, request, address, contributorsCount }: Props) {
  const router = useRouter();
  const { Row, Cell } = Table;
  const { description, amount, recipient, approvalCount, complete } = request;
  const readyToFinalize = contributorsCount >= (contributorsCount / 2);

  const approve = async() => {
    await Campaign(address).methods.approveRequest(id).send({
      from: window.ethereum.selectedAddress
    });

    router.reload();
  }

  const finalize = async () => {
    await Campaign(address).methods.finalizeRequest(id).send({
      from: window.ethereum.selectedAddress
    });

    router.reload();
  }

  return (
    <Row disabled={complete} positive={readyToFinalize && !complete}>
      <Cell>{id}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(amount, 'ether')}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>{approvalCount}/{contributorsCount}</Cell>
      <Cell>
        {!complete && <Button onClick={approve} color='green' basic>Approve</Button>}
      </Cell>
      <Cell>
        {!complete && readyToFinalize && <Button onClick={finalize} color='red' basic>Finalize</Button>}
      </Cell>
    </Row>
  );
}
