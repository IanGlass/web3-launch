import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import Link from 'next/link';

export default function Header() {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Menu.Item>
        <Link href='/'>
          <Button style={{ boxShadow: 'none' }} basic>
            CrowdCoin
          </Button>
        </Link>
      </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item>
          <Link href='/campaigns'>
            <Button style={{ boxShadow: 'none' }} basic>
              Campaigns
            </Button>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href='/campaigns/new'>
            <Button
              style={{ boxShadow: 'none' }}
              icon='add'
              basic
            />
          </Link>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}
