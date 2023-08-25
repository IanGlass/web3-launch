import React, { FormEvent, useState } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import createFactory from '../../ethereum/factory';
import fs from 'fs';

export default function NewCampaign({ address }) {
  const [minimumContribution, setMinimumContribution] = useState('');

  console.log(address);
  const createCampaign = async (event: FormEvent) => {
    console.log(address);
    event.preventDefault();

    await createFactory(address)
    .methods
    .createCampaign(minimumContribution)
    .send({
      
    });
  };

  return (
    <>
      <h3>Create a Campaign</h3>
      <Form onSubmit={createCampaign}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            value={minimumContribution}
            label='wei'
            labelPosition='right'
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>
        <Button type='submit' primary>
          Create
        </Button>
      </Form>
    </>
  );
}

export function getServerSideProps() {
  const address = fs.readFileSync('./FACTORY_ADDRESS', 'utf-8');
  return {
    props: {
      address
    }
  }
}
