/* eslint-disable @typescript-eslint/no-explicit-any */
/*
adapted from material-ui https://github.com/mui-org/material-ui/blob/1b9c44b82183d804c38b80dcad1fd9265d0761c8/packages/mui-material/src/ButtonBase/ButtonBase.js
@see MUI_LICENSE
*/
import { css } from '@linaria/core'
import React, {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react'
import { clsx, withStyles, WithStyles } from '@src/styles'
import useEventCallback from '@src/util/hooks/useEventCallback'
import useForkRef from '@src/util/hooks/useForkRef'
import useIsFocusVisible from '@src/util/hooks/useIsFocusVisible'
import {
  OverridableComponent,
  OverridableTypeMap,
  OverrideProps,
} from '@src/util/types/OverridableComponent'

const styles = {
  /* Styles applied to the root element. */
  root: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
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
    text-decoration: none;
    color: inherit;
    &::-moz-focus-inner {
      border-style: none;
    }
    @media print {
      color-adjust: exact;
    }
  `,
  /* Pseudo-class applied to the root element if `disabled={true}`. */
  disabled: css`
    pointer-events: none;
    cursor: default;
  `,
  /* Pseudo-class applied to the root element if keyboard focused. */
  focusVisible: '',
}

type ButtonBaseClassKey = keyof typeof styles

export interface ButtonBaseActions {
  focusVisible(): void
}

export interface ButtonBaseTypeMap<
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {},
  D extends React.ElementType = 'button',
> {
  props: P & {
    /**
     * A ref for imperative actions.
     * It currently only supports `focusVisible()` action.
     */
    action?: React.Ref<ButtonBaseActions>
    /**
     * The content of the component.
     */
    children?: React.ReactNode
    /**
     * If `true`, the component is disabled.
     * @default false
     */
    disabled?: boolean
    /**
     * The component used to render a link when the `href` prop is provided.
     * @default 'a'
     */
    LinkComponent?: React.ElementType
    /**
     * Callback fired when the component is focused with a keyboard.
     * We trigger a `onFocus` callback too.
     */
    onFocusVisible?: React.FocusEventHandler<any>
    /**
     * @default 0
     */
    tabIndex?: NonNullable<React.HTMLAttributes<any>['tabIndex']>
  }
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
  P = {},
> = OverrideProps<ButtonBaseTypeMap<P, D>, D>

type Props = Parameters<ExtendButtonBase<ButtonBaseTypeMap>>[0] & {
  component?: React.ElementType
  href?: string
}

const ButtonBase = forwardRef<unknown, WithStyles<Props, typeof styles>>(
  function ButtonBase(props, ref) {
    const {
      action,
      component = 'button',
      tabIndex = 0,
      disabled = false,
      type,
      onFocus,
      onFocusVisible,
      onBlur,
      onKeyDown,
      onKeyUp,
      onClick,
      children,
      LinkComponent = 'a',
      classes,
      ...other
    } = props
    const buttonRef = useRef<HTMLElement | null>(null)

    const {
      isFocusVisibleRef,
      onFocus: handleFocusVisible,
      onBlur: handleBlurVisible,
      ref: focusVisibleRef,
    } = useIsFocusVisible()
    const [focusVisible, setFocusVisible] = useState(false)
    if (disabled && focusVisible) {
      setFocusVisible(false)
    }

    useImperativeHandle(
      action,
      () => ({
        focusVisible: () => {
          setFocusVisible(true)
          buttonRef.current?.focus()
        },
      }),
      [],
    )

    const handleBlur = (event: React.FocusEvent<any>) => {
      handleBlurVisible(event)
      if (isFocusVisibleRef.current === false) {
        setFocusVisible(false)
      }
      if (onBlur) {
        onBlur(event)
      }
    }

    const handleFocus = useEventCallback((event: FocusEvent<HTMLElement>) => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!buttonRef.current) {
        buttonRef.current = event.currentTarget
      }

      handleFocusVisible(event)
      if (isFocusVisibleRef.current === true) {
        setFocusVisible(true)

        if (onFocusVisible) {
          onFocusVisible(event)
        }
      }

      if (onFocus) {
        onFocus(event as FocusEvent<HTMLButtonElement>)
      }
    })

    const isNonNativeButton = () => {
      const button = buttonRef.current
      return (
        component &&
        component !== 'button' &&
        !(
          button?.tagName === 'A' &&
          (button as typeof button & { href?: string })?.href
        )
      )
    }

    const handleKeyDown = useEventCallback(
      (event: KeyboardEvent<HTMLElement>) => {
        if (
          event.target === event.currentTarget &&
          isNonNativeButton() &&
          event.key === ' '
        ) {
          event.preventDefault()
        }

        if (onKeyDown) {
          onKeyDown(event as KeyboardEvent<HTMLButtonElement>)
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
            onClick(event as unknown as MouseEvent<HTMLButtonElement>)
          }
        }
      },
    )

    const handleKeyUp = useEventCallback(
      (event: KeyboardEvent<HTMLButtonElement>) => {
        // calling preventDefault in keyUp on a <button> will not dispatch a click event if Space is pressed
        // https://codesandbox.io/s/button-keyup-preventdefault-dn7f0
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
          onClick(event as unknown as MouseEvent<HTMLButtonElement>)
        }
      },
    )

    let ComponentProp = component

    if (
      ComponentProp === 'button' &&
      (other.href || (other as typeof other & { to?: string }).to)
    ) {
      ComponentProp = LinkComponent
    }

    const buttonProps: JSX.IntrinsicElements['button'] = {}
    if (ComponentProp === 'button') {
      buttonProps.type = type === undefined ? 'button' : type
      buttonProps.disabled = disabled
    } else {
      if (!other.href && !(other as typeof other & { to?: string }).to) {
        buttonProps.role = 'button'
      }
      if (disabled) {
        buttonProps['aria-disabled'] = disabled
      }
    }

    const handleOwnRef = useForkRef(focusVisibleRef, buttonRef)
    const handleRef = useForkRef(ref, handleOwnRef)

    return (
      <ComponentProp
        className={clsx(
          classes.root,
          disabled && classes.disabled,
          focusVisible && classes.focusVisible,
        )}
        onBlur={handleBlur}
        onClick={onClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        ref={handleRef}
        tabIndex={disabled ? -1 : tabIndex}
        type={type}
        {...buttonProps}
        {...other}
      >
        {children}
      </ComponentProp>
    )
  },
)

export default withStyles(styles, { name: 'ButtonBase' })(
  ButtonBase as any,
) as ExtendButtonBase<ButtonBaseTypeMap>
