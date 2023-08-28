import web3 from '@/ethereum/web3';
import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '@/ethereum/campaign';
import { useRouter } from 'next/router';

export default function RequestRow({ id, request, address, approversCount }) {
  const router = useRouter();
  const { Row, Cell } = Table;
  const { description, amount, recipient, approvalCount, complete } = request;

  const approve = async() => {
    const accounts = await web3.eth.getAccounts();
    await Campaign(address).methods.approveRequest(id).send({
      from: accounts[0]
    });

    router.reload();
  }

  const finalize = async () => {
    const accounts = await web3.eth.getAccounts();
    await Campaign(address).methods.finalizeRequest(id).send({
      from: accounts[0]
    });

    router.reload();
  }

  return (
    <Row>
      <Cell>{id}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(amount, 'ether')}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>{approvalCount}/{approversCount}</Cell>
      <Cell>
        <Button onClick={approve} color='green' basic>Approve</Button>
      </Cell>
      <Cell>
        <Button onClick={finalize} color='red' basic>Finalize</Button>
      </Cell>
    </Row>
  );
}
