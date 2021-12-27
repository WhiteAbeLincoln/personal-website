import React from 'react'
import { Helmet } from 'react-helmet'
import Container from '@src/components/Container'
import Layout from '@src/components/Layout'
import { H1, P } from '@src/components/typography/Elements'

const Writing = () => (
  <>
    <Helmet>
      <title>Abraham White - Writing</title>
    </Helmet>
    <Layout>
      <Container>
        <H1>Writing</H1>
        <P>This page is a work in progress.</P>
      </Container>
    </Layout>
  </>
)

export default Writing
