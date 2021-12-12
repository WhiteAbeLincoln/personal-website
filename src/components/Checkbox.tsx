/** @jsx jsx */
import React from 'react'
import Typography, { TypographyProps } from '@comps/typography'
import { forwardRef } from 'react'
import { getBorderAndColor, getFocusedBorder, spacing, Theme, withCSSGetter } from '@src/styles/theme'
import { css, jsx, } from '@emotion/react'

const inputStyles = withCSSGetter(getFocusedBorder, ({ focusedBorder, notFocusedBorder }) =>
  css`
    position: absolute;
    width: 1em;
    height: 1em;
    margin: 0;
    outline: 0;
    opacity: 0;
    &:hover:enabled + svg, &:focus + svg {
      ${focusedBorder}
    }
    &:focus:not(:focus-visible):not(:hover) + svg {
      ${notFocusedBorder}
    }
    &:checked + svg polyline {
      stroke: currentColor;
    }
  `
)

const iconStyles = withCSSGetter(getBorderAndColor, ({ baseBorder, theme, color }) =>
  css`
    ${baseBorder}
    width: 1em;
    height: 1em;
    margin-right: ${spacing(theme)(1)};
    margin-top: 0.1em;
    z-index: 2;
    & * {
      transition: all 0.1s;
    }
    color: ${color};
  `
)

type Props = {
  label?: React.ReactNode
  labelProps?: JSX.IntrinsicElements['label']
  textProps?: TypographyProps<'span'>
  disabled?: boolean
  checked?: boolean
  name?: string
  value?: string | number | readonly string[]
  color?: 'inherit' | 'primary' | 'secondary'
} & JSX.IntrinsicElements['input']

export default forwardRef<HTMLInputElement, Props>(function Checkbox(
  {
    label,
    labelProps,
    textProps,
    color = 'primary',
    ...props
  }: Props,
  ref,
) {
  return (
    <label
      css={css`
        cursor: pointer;
        display: flex;
        align-items: start;
      `}
      {...labelProps}
    >
      <input
        type="checkbox"
        css={inputStyles()}
        ref={ref}
        {...props}
      />
      <svg
        css={iconStyles({ color })}
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <polyline
          points="4,14 12,23 28,5"
          stroke="transparent"
          strokeWidth="4"
          fill="none"
        />
      </svg>
      <Typography css={css`font-size: inherit;`} component="span" {...textProps}>
        {label}
      </Typography>
    </label>
  )
})
