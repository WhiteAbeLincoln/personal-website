import React from 'react'
import { Helmet } from 'react-helmet'
import Layout from '@comps/Layout'
import Container from '@comps/Container'
import { H1, P } from '@comps/typography/Elements'

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
