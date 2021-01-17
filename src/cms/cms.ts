import CMS from 'netlify-cms-app'

CMS.init({
  config: {
    load_config_file: false,
    backend: {
      name: 'github',
      repo: 'WhiteAbeLincoln/personal-website',
      branch: 'source',
    },
    publish_mode: 'editorial_workflow',
    local_backend: process.env.NODE_ENV === 'development',
    media_folder: 'static/assets',
    public_folder: '/assets',
    collections: [],
  },
})
