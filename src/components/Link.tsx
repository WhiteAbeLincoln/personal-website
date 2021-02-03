/*
 * Taken from material-ui
 * @see MUI_LICENSE
 */
import React from 'react'
import Typography, { TypographyProps } from '@comps/typography'
import { createStyles } from '@material-ui/styles'
import { forwardRef } from 'react'
import { capitalize, clsx } from '@util/util'
import {
  OverridableComponent,
  OverrideProps,
} from '@util/types/OverridableComponent'
import useForkRef from '@util/hooks/useForkRef'
import useIsFocusVisible from '@util/hooks/useIsFocusVisible'

export const styles = createStyles({
  /* Styles applied to the root element. */
  root: {
    '&:visited': {
      color: '#774755',
    },
  },
  /* Styles applied to the root element if `underline="none"`. */
  underlineNone: {
    textDecoration: 'none',
  },
  /* Styles applied to the root element if `underline="hover"`. */
  underlineHover: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  /* Styles applied to the root element if `underline="always"`. */
  underlineAlways: {
    textDecoration: 'underline',
  },
  button: {
    position: 'relative',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: 'transparent', // Reset default value
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    border: 0,
    margin: 0, // Remove the margin in Safari
    borderRadius: 0,
    padding: 0, // Remove the padding in Firefox
    cursor: 'pointer',
    userSelect: 'none',
    verticalAlign: 'middle',
    '-moz-appearance': 'none', // Reset
    '-webkit-appearance': 'none', // Reset
    '&::-moz-focus-inner': {
      borderStyle: 'none', // Remove Firefox dotted outline.
    },
    '&$focusVisible': {
      outline: 'auto',
    },
  },
  /* Pseudo-class applied to the root element if the link is keyboard focused. */
  focusVisible: {},
})

type LinkClassKey = keyof typeof styles

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
  P = {}
> = OverrideProps<LinkTypeMap<P, D>, D>

type Props = LinkProps & { component?: React.ElementType }

const Link = forwardRef<unknown, Props>(function Link(
  {
    classes = {},
    className,
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
    isFocusVisible,
    onBlurVisible,
    ref: focusVisibleRef,
  } = useIsFocusVisible()
  const [focusVisible, setFocusVisible] = React.useState(false)
  const handlerRef = useForkRef(ref, focusVisibleRef)
  const handleBlur: React.FocusEventHandler<HTMLAnchorElement> = event => {
    if (focusVisible) {
      onBlurVisible()
      setFocusVisible(false)
    }
    if (onBlur) {
      onBlur(event)
    }
  }
  const handleFocus: React.FocusEventHandler<HTMLAnchorElement> = event => {
    if (isFocusVisible(event)) {
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
        focusVisible && classes.focusVisible,
        classes[`underline${capitalize(underline)}` as const],
        className,
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
})

export default Link as OverridableComponent<LinkTypeMap>
