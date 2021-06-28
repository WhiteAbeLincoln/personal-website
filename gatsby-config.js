/* eslint-env node */

module.exports = {
  siteMetadata: {
    title: 'Abraham White',
    siteUrl: 'https://abewhite.dev',
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        enableIdentityWidget: false,
        modulePath: `${__dirname}/src/cms/cms.ts`,
        manualInit: true,
      },
    },
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@util': './src/util',
          '@comps': './src/components',
          '@styles': './src/styles',
          '@src': './src',
        },
      },
    },
    'gatsby-plugin-material-ui',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: '258327814',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'page_data',
        path: `${__dirname}/src/data/pages`,
      },
      __key: 'page_data',
    },
    'gatsby-plugin-mdx',
    {
      resolve: 'gatsby-transformer-remark-frontmatter',
      options: { preset: 'Mdx' }
    }
  ],
}
