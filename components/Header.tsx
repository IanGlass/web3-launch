import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item>
        <Button
          style={{ boxShadow: 'none' }}
          basic
          onClick={() => router.push('/')}
        >
          CrowdCoin
        </Button>
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item>
          <Button
            style={{ boxShadow: 'none' }}
            basic
            onClick={() => router.push('/campaigns')}
          >
            Campaigns
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            style={{ boxShadow: 'none' }}
            onClick={() => router.push('/campaigns/new')}
            icon='add'
            basic
          />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
