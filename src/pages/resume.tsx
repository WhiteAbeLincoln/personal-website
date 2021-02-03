import React from 'react'
import { Helmet } from 'react-helmet'
import Layout from '@comps/Layout'
import { H1, P } from '@comps/typography/Elements'
import Container from '@comps/Container'
import Link from '@comps/Link'

const Resume = () => (
  <>
    <Helmet>
      <title>Abraham White - Resume</title>
    </Helmet>
    <Layout>
      <Container>
        <H1>Résumé</H1>
        <P>This page is a work in progress.</P>
        <P>In the meantime, you can download the <Link href="/resume.pdf">pdf version of my resume</Link>.</P>
      </Container>
    </Layout>
  </>
)

export default Resume
