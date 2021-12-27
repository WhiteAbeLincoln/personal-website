import React, { forwardRef } from 'react'
import Link, { LinkTypeMap } from './Link'
import LinkWrapper from './LinkWrapper'
import { OverrideProps } from '@src/util/types/OverridableComponent'

export type GLinkProps = OverrideProps<LinkTypeMap, typeof LinkWrapper>
const GLink = forwardRef<HTMLAnchorElement, GLinkProps>(function GLink(
  props,
  ref,
) {
  return <Link ref={ref} component={LinkWrapper} {...props} />
})

export default GLink
