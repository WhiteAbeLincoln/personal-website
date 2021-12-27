import React from 'react'
import { Helmet } from 'react-helmet'
import Container from '@src/components/Container'
import Layout from '@src/components/Layout'
import { H1, P } from '@src/components/typography/Elements'

const Contact = () => (
  <>
    <Helmet>
      <title>Abraham White - Contact</title>
    </Helmet>
    <Layout>
      <Container>
        <H1>Contact</H1>
        <P>This page is a work in progress.</P>
      </Container>
    </Layout>
  </>
)

export default Contact
