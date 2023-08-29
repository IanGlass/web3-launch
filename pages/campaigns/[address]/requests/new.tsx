import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '@/ethereum/campaign';
import web3 from '@/ethereum/web3';
import Link from 'next/link';

export default function NewRequest() {
  const router = useRouter();
  const address = router.query.address as string;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState('');
  const [value, setValue] = useState();
  const [recipient, setRecipient] = useState();

  const createRequest = async (event: FormEvent) => {
    setLoading(true);
    setError('');
    try {
      await Campaign(address)
        .methods.createRequest(
          description,
          web3.utils.toWei(value, 'ether'),
          recipient
        )
        .send({
          from: window.ethereum.selectedAddress,
        });

      router.push(`/campaigns/${address}/requests`);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Link href={`/campaigns/${address}/requests`}>Back</Link>
      <h3>Create a request to spend campaign funds</h3>
      <Form onSubmit={createRequest} error={!!error}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            label='ether'
            labelPosition='right'
            onChange={(event) => setValue(event.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Recipient address</label>
          <Input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </Form.Field>

        {error && <Message negative header='Oops!' content={error} />}
        <Button loading={loading} type='submit' primary>
          Create
        </Button>
      </Form>
    </>
  );
}
