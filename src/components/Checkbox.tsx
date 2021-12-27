import { css } from '@linaria/core'
import React, { forwardRef } from 'react'
import Typography, { TypographyProps } from '@src/components/typography'
import { border, clsx, getVar, spacing } from '@src/styles'
import { capitalize } from '@src/util'

const styles = {
  icon: css`
    ${border.base}
    width: 1em;
    height: 1em;
    margin-top: 0.1em;
    z-index: 2;
    & * {
      transition: all 0.1s;
    }
  `,
  colorInherit: css`
    color: inherit;
  `,
  colorPrimary: css`
    color: ${getVar('palette-primary-main')};
  `,
  colorSecondary: css`
    color: ${getVar('palette-secondary-main')};
  `,
  input: css`
    position: absolute;
    width: 1em;
    height: 1em;
    margin: 0;
    outline: 0;
    opacity: 0;
    &:hover:enabled + svg,
    &:focus + svg {
      ${border.focused}
    }
    &:focus:not(:focus-visible):not(:hover) + svg {
      ${border.base}
    }
    &:checked + svg polyline {
      stroke: currentColor;
    }
  `,
  label: css`
    cursor: pointer;
    display: inline-flex;
    align-items: start;
    gap: ${spacing(1)};
  `,
}

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
  { label, labelProps, textProps, color = 'primary', ...props }: Props,
  ref,
) {
  return (
    <label className={styles.label} {...labelProps}>
      <input
        type="checkbox"
        className={clsx(styles.input, styles[`color${capitalize(color)}`])}
        ref={ref}
        {...props}
      />
      <svg
        className={clsx(styles.icon, styles[`color${capitalize(color)}`])}
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
      <Typography
        className={css`
          font-size: inherit;
        `}
        component="span"
        {...textProps}
      >
        {label}
      </Typography>
    </label>
  )
})
