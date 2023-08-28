import React, { FormEvent, useState } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Factory from '@/ethereum/factory';
import fs from 'fs';
import web3 from '@/ethereum/web3';
import { useRouter } from 'next/router';

export function getServerSideProps() {
  const address = fs.readFileSync('./FACTORY_ADDRESS', 'utf-8');
  return {
    props: {
      address,
    }
  }
}

export default function NewCampaign({ address }) {
  const router = useRouter();
  const [minimumContribution, setMinimumContribution] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createCampaign = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    try {
      const accounts = await web3.eth.getAccounts();
      await Factory(address)
      .methods
      .createCampaign(minimumContribution)
      .send({
        from: accounts[0]
      });

      router.push('/');
    } catch(error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <h3>Create a Campaign</h3>
      <Form onSubmit={createCampaign} error={!!error}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            value={minimumContribution}
            label='wei'
            labelPosition='right'
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>
        {error && <Message negative header="Oops!" content={error} />}
        <Button loading={loading} type='submit' primary>
          Create
        </Button>
      </Form>
    </>
  );
}

