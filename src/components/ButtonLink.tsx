import React from 'react'
import Button, { ButtonTypeMap } from './Button'
import { OverrideProps } from '@util/types/OverridableComponent'
import LinkWrapper from './LinkWrapper'

export type ButtonLinkProps = OverrideProps<ButtonTypeMap, typeof LinkWrapper>
const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(props, ref) {
    return <Button ref={ref} component={LinkWrapper} role={undefined} {...props} />
  },
)

export default ButtonLink
