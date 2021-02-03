import React from 'react'
import { OverrideProps } from '@util/types/OverridableComponent'
import Link, { LinkTypeMap } from './Link'
import LinkWrapper from './LinkWrapper'

export type GLinkProps = OverrideProps<LinkTypeMap, typeof LinkWrapper>
const GLink = React.forwardRef<HTMLAnchorElement, GLinkProps>(function GLink(
  props,
  ref,
) {
  return <Link ref={ref} component={LinkWrapper} {...props} />
})

export default GLink
