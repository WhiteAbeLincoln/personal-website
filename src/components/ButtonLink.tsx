import React, { forwardRef } from 'react'
import Button, { ButtonTypeMap } from './Button'
import LinkWrapper from './LinkWrapper'
import { OverrideProps } from '@src/util/types/OverridableComponent'

export type ButtonLinkProps = OverrideProps<ButtonTypeMap, typeof LinkWrapper>
const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(props, ref) {
    return (
      <Button ref={ref} component={LinkWrapper} role={undefined} {...props} />
    )
  },
)

export default ButtonLink
