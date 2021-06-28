import { bodyField, mdxCollection, seoField, templateKey, titleField } from '../utility-fields';

export const portfolioCollection = {
  ...mdxCollection,
  name: 'portfolio',
  label: 'Portfolio',
  folder: 'src/data/pages/portfolio',
  create: true,
  delete: true,
  fields: [
    templateKey('simple'),
    titleField,
    {
      name: 'summary',
      label: 'Summary',
      widget: 'markdown',
      required: false
    },
    {
      name: 'tags',
      label: 'Tags',
      widget: 'list'
    },
    bodyField,
    seoField
  ]
} as const
