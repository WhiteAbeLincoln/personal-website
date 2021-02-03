/* eslint-disable @typescript-eslint/no-explicit-any */
/*
taken from material-ui
@see MUI_LICENSE
*/
import React, { PropsWithChildren, ReactInstance } from 'react'
import { createStyles, withStyles } from '@material-ui/styles'
import {
  OverridableComponent,
  OverridableTypeMap,
  OverrideProps,
} from '@util/types/OverridableComponent'
import { clsx } from '@util/util'
import useIsFocusVisible from '@util/hooks/useIsFocusVisible'
import useEventCallback from '@util/hooks/useEventCallback'
import ReactDOM from 'react-dom'
import useForkRef from '@util/hooks/useForkRef'

export const styles = createStyles({
  /* Styles applied to the root element. */
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    textDecoration: 'none',
    // So we take precedent over the style of a native <a /> element.
    color: 'inherit',
    '&::-moz-focus-inner': {
      borderStyle: 'none', // Remove Firefox dotted outline.
    },
    '&$disabled': {
      pointerEvents: 'none', // Disable link interactions
      cursor: 'default',
    },
    '@media print': {
      colorAdjust: 'exact',
    },
  },
  /* Pseudo-class applied to the root element if `disabled={true}`. */
  disabled: {},
  /* Pseudo-class applied to the root element if keyboard focused. */
  focusVisible: {},
})

export type ButtonBaseClassKey = keyof typeof styles
export interface ButtonBaseTypeMap<
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {},
  D extends React.ElementType = 'button'
> {
  props: P &
    PropsWithChildren<{
      disabled?: boolean
      /**
       * This prop can help a person know which element has the keyboard focus.
       * The class name will be applied when the element gain the focus through a keyboard interaction.
       * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
       * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/master/explainer.md).
       * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
       * if needed.
       */
      focusVisibleClassName?: string
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFocusVisible?: React.FocusEventHandler<any>
      onClick?: React.EventHandler<
        React.MouseEvent<any> | React.KeyboardEvent<any>
      >
      tabIndex?: string | number
    }>
  defaultComponent: D
  classKey: ButtonBaseClassKey
}

/**
 * utility to create component types that inherit props from ButtonBase.
 * This component has an additional overload if the `href` prop is set which
 * can make extension quite tricky
 */
export interface ExtendButtonBaseTypeMap<M extends OverridableTypeMap> {
  props: M['props'] & ButtonBaseTypeMap['props']
  defaultComponent: M['defaultComponent']
  classKey: M['classKey']
}

export type ExtendButtonBase<M extends OverridableTypeMap> = ((
  props: { href: string } & OverrideProps<ExtendButtonBaseTypeMap<M>, 'a'>,
) => JSX.Element) &
  OverridableComponent<ExtendButtonBaseTypeMap<M>>

export type ButtonBaseProps<
  D extends React.ElementType = ButtonBaseTypeMap['defaultComponent'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {}
> = OverrideProps<ButtonBaseTypeMap<P, D>, D>

type Props = Parameters<ExtendButtonBase<ButtonBaseTypeMap>>[0] & {
  component?: React.ElementType
  href?: string
}

const ButtonBase = React.forwardRef<unknown, Props>(function ButtonBase(
  {
    component = 'button',
    tabIndex = 0,
    disabled = false,
    type = 'button',
    classes = {},
    onFocus,
    onFocusVisible,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClick,
    focusVisibleClassName,
    className,
    ...other
  },
  ref,
) {
  const buttonRef = React.useRef<ReactInstance | null>(null)
  function getButtonNode() {
    // #StrictMode ready
    return ReactDOM.findDOMNode(buttonRef.current)
  }
  const [focusVisible, setFocusVisible] = React.useState(false)
  if (disabled && focusVisible) {
    setFocusVisible(false)
  }
  const {
    isFocusVisible,
    onBlurVisible,
    ref: focusVisibleRef,
  } = useIsFocusVisible()

  const handleFocus = useEventCallback((event: React.FocusEvent<any>) => {
    // Fix for https://github.com/facebook/react/issues/7769
    if (!buttonRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      buttonRef.current = event.currentTarget
    }

    if (isFocusVisible(event)) {
      setFocusVisible(true)

      if (onFocusVisible) {
        onFocusVisible(event)
      }
    }

    if (onFocus) {
      onFocus(event)
    }
  })

  const handleBlur = useEventCallback((event: React.FocusEvent<any>) => {
    if (focusVisible) {
      onBlurVisible()
      setFocusVisible(false)
    }
    if (onBlur) {
      onBlur(event)
    }
  })

  const isNonNativeButton = () => {
    const button = getButtonNode()
    return (
      component &&
      component !== 'button' &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      !((button as any)?.tagName === 'A' && (button as any)?.href)
    )
  }

  /**
   * IE 11 shim for https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
   */
  const keydownRef = React.useRef(false)
  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<any>) => {
    // Check if key is already down to avoid repeats being counted as multiple activations
    if (!keydownRef.current && focusVisible && event.key === ' ') {
      keydownRef.current = true
      event.persist()
    }

    if (
      event.target === event.currentTarget &&
      isNonNativeButton() &&
      event.key === ' '
    ) {
      event.preventDefault()
    }

    if (onKeyDown) {
      onKeyDown(event)
    }

    // Keyboard accessibility for non interactive elements
    if (
      event.target === event.currentTarget &&
      isNonNativeButton() &&
      event.key === 'Enter' &&
      !disabled
    ) {
      event.preventDefault()
      if (onClick) {
        onClick(event)
      }
    }
  })

  const handleKeyUp = useEventCallback((event: React.KeyboardEvent<any>) => {
    // calling preventDefault in keyUp on a <button> will not dispatch a click event if Space is pressed
    // https://codesandbox.io/s/button-keyup-preventdefault-dn7f0
    if (event.key === ' ' && focusVisible && !event.defaultPrevented) {
      keydownRef.current = false
      event.persist()
    }
    if (onKeyUp) {
      onKeyUp(event)
    }

    // Keyboard accessibility for non interactive elements
    if (
      onClick &&
      event.target === event.currentTarget &&
      isNonNativeButton() &&
      event.key === ' ' &&
      !event.defaultPrevented
    ) {
      onClick(event)
    }
  })

  let ComponentProp = component

  if (ComponentProp === 'button' && other.href) {
    ComponentProp = 'a'
  }

  const buttonProps: JSX.IntrinsicElements['button'] = {}
  if (ComponentProp === 'button') {
    buttonProps.type = type
    buttonProps.disabled = disabled
  } else {
    if (ComponentProp !== 'a' || !other.href) {
      buttonProps.role = 'button'
    }
    buttonProps['aria-disabled'] = disabled
  }

  const handleOwnRef = useForkRef(focusVisibleRef, buttonRef)
  const handleRef = useForkRef(ref, handleOwnRef)

  return (
    <ComponentProp
      ref={handleRef}
      className={clsx(
        classes.root,
        disabled && classes.disabled,
        focusVisible && classes.focusVisible,
        focusVisible && focusVisibleClassName,
        className,
      )}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={disabled ? -1 : tabIndex}
      {...buttonProps}
      {...other}
    />
  )
})

export default withStyles(styles, { name: 'ButtonBase' })(
  ButtonBase,
) as ExtendButtonBase<ButtonBaseTypeMap>
