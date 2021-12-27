import React from 'react'
import { Helmet } from 'react-helmet'
import Container from '@src/components/Container'
import Layout from '@src/components/Layout'
import Link from '@src/components/Link'
import { H1, P } from '@src/components/typography/Elements'

const Resume = () => (
  <>
    <Helmet>
      <title>Abraham White - Resume</title>
    </Helmet>
    <Layout>
      <Container>
        <H1>Résumé</H1>
        <P>This page is a work in progress.</P>
        <P>
          In the meantime, you can download the{' '}
          <Link href="/resume.pdf">pdf version of my resume</Link>.
        </P>
      </Container>
    </Layout>
  </>
)

export default Resume
