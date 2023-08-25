import React from 'react';
import Layout from '../components/Layout';

export default function App({ Component, PageProps }) {
  return (
    <Layout>
      <Component {...PageProps} />
    </Layout>
  )
}