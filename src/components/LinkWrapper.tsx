import React, { forwardRef } from 'react'
import { Link as GLink, GatsbyLinkProps } from 'gatsby'
import type { LinkGetProps, AnchorProps } from '@reach/router'
import { clsx } from '@util/util'

export type GetProps = (
  opts: LinkGetProps & { partiallyActive: boolean },
  defProps: Partial<AnchorProps>,
  // eslint-disable-next-line @typescript-eslint/ban-types
) => Partial<AnchorProps>
export type LinkProps<TState> = Omit<GatsbyLinkProps<TState>, 'getProps'> & {
  getProps?: GetProps
}

const Link = forwardRef<HTMLAnchorElement, LinkProps<unknown>>(function Link(
  { getProps, ...props },
  ref,
) {
  const defaultGetProps = (opts: LinkGetProps): Partial<AnchorProps> => {
    const { isPartiallyCurrent, isCurrent } = opts
    if (props.partiallyActive ? isPartiallyCurrent : isCurrent) {
      return {
        className: clsx(props.className, props.activeClassName),
        style: { ...props.style, ...props.activeStyle },
      }
    }

    return {}
  }

  const handleGetProps = (opts: LinkGetProps) => {
    const defProps = defaultGetProps(opts)
    return getProps
      ? getProps(
          { ...opts, partiallyActive: props.partiallyActive ?? false },
          defProps,
        )
      : defProps
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
  return <GLink ref={ref as any} getProps={handleGetProps} {...props} />
})

export default Link as <TState>(
  props: LinkProps<TState>,
) => React.ReactElement | null
