import React, { FormEvent, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '@/ethereum/campaign';
import web3 from '@/ethereum/web3';
import { useRouter } from 'next/router';

interface Props {
  address: string;
}

export default function ContributeForm({ address }: Props) {
  const router = useRouter();
  const [contribution, setContribution] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const contribute = async (event: FormEvent) => {
    setLoading(true);
    setError('');
    try {
      await Campaign(address)
        .methods.contribute()
        .send({
          from: window.ethereum.selectedAddress,
          value: web3.utils.toWei(contribution, 'ether'),
        });
      router.reload();
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Form error={!!error}>
      <h3>Contribute to this campaign!</h3>
      <Form.Field >
        <label>Amount to contribute</label>
        <Input
          label='ether'
          labelPosition='right'
          value={contribution}
          onChange={(event) => setContribution(event.target.value)}
        />
      </Form.Field>
      {error && <Message negative header='Oops!' content={error} />}
      <Button loading={loading} onClick={contribute} primary>
        Contribute!
      </Button>
    </Form>
  );
}
