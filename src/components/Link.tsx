import { css } from '@linaria/core'
import React, { forwardRef, useState } from 'react'
import Typography, { TypographyProps } from '@src/components/typography'
import { clsx, WithStyles, withStyles } from '@src/styles'
import { capitalize } from '@src/util'
import useForkRef from '@src/util/hooks/useForkRef'
import useIsFocusVisible from '@src/util/hooks/useIsFocusVisible'
import {
  OverridableComponent,
  OverrideProps,
} from '@src/util/types/OverridableComponent'

const styles = {
  root: css`
    &:visited {
      color: #774755;
    }
  `,
  /* Styles applied to the root element if `underline="none"`. */
  underlineNone: css`
    text-decoration: none;
  `,
  /* Styles applied to the root element if `underline="hover"`. */
  underlineHover: css`
    text-decoration: none;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  `,
  /* Styles applied to the root element if `underline="always"`. */
  underlineAlways: css`
    text-decoration: underline;
  `,
  button: css`
    position: relative;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0;
    border: 0;
    margin: 0;
    border-radius: 0;
    padding: 0;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    &::-moz-focus-inner {
      border-style: none;
    }
  `,
  /* Pseudo-class applied to the root element if the link is keyboard focused. */
  focusVisible: '',
}

type LinkClassKey = keyof typeof styles

// eslint-disable-next-line @typescript-eslint/ban-types
export interface LinkTypeMap<P = {}, D extends React.ElementType = 'a'> {
  props: P &
    LinkBaseProps & {
      TypographyClasses?: TypographyProps['classes']
      underline?: 'none' | 'hover' | 'always'
    }
  defaultComponent: D
  classKey: LinkClassKey
}

export type LinkBaseProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<TypographyProps, 'component'>

export type LinkProps<
  D extends React.ElementType = LinkTypeMap['defaultComponent'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {},
> = OverrideProps<LinkTypeMap<P, D>, D>

type Props = LinkProps & { component?: React.ElementType }

const Link = forwardRef<unknown, WithStyles<Props, typeof styles>>(
  function Link(
    {
      classes,
      color = 'secondary',
      component = 'a',
      onBlur,
      onFocus,
      TypographyClasses,
      underline = 'always',
      variant = 'inherit',
      ...other
    },
    ref,
  ) {
    const {
      isFocusVisibleRef,
      onBlur: handleBlurVisible,
      onFocus: handleFocusVisible,
      ref: focusVisibleRef,
    } = useIsFocusVisible()
    const [focusVisible, setFocusVisible] = useState(false)
    const handlerRef = useForkRef(ref, focusVisibleRef)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBlur = (event: React.FocusEvent<any>) => {
      handleBlurVisible(event)
      if (isFocusVisibleRef.current === false) {
        setFocusVisible(false)
      }
      if (onBlur) {
        onBlur(event)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFocus = (event: React.FocusEvent<any>) => {
      handleFocusVisible(event)
      if (isFocusVisibleRef.current === true) {
        setFocusVisible(true)
      }
      if (onFocus) {
        onFocus(event)
      }
    }

    return (
      <Typography
        className={clsx(
          classes.root,
          component === 'button' && classes.button,
          classes[`underline${capitalize(underline)}`],
        )}
        classes={TypographyClasses}
        color={color}
        component={component}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={handlerRef}
        variant={variant}
        {...other}
      />
    )
  },
)

export default withStyles(styles, { name: 'Link' })(
  Link as any,
) as OverridableComponent<LinkTypeMap>
