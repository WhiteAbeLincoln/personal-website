/*
 * Taken from material-ui
 * @see MUI_LICENSE
 */
import { css } from '@linaria/core'
import React, { forwardRef } from 'react'
import {
  clsx,
  getVar,
  typography,
  TypographyVariant,
  withStyles,
  WithStyles,
} from '@src/styles'
import { capitalize } from '@src/util'
import {
  OverridableComponent,
  OverrideProps,
} from '@src/util/types/OverridableComponent'

const styles = {
  root: css`
    margin: 0;
  `,
  body2: css`
    ${typography('body2')}
  `,
  body1: css`
    ${typography('body1')}
  `,
  caption: css`
    ${typography('caption')}
  `,
  button: css`
    ${typography('button')}
  `,
  display: css`
    ${typography('display')}
  `,
  h1: css`
    ${typography('h1')}
  `,
  h2: css`
    ${typography('h2')}
  `,
  h3: css`
    ${typography('h3')}
  `,
  h4: css`
    ${typography('h4')}
  `,
  h5: css`
    ${typography('h5')}
  `,
  h6: css`
    ${typography('h6')}
  `,
  subtitle1: css`
    ${typography('subtitle1')}
  `,
  subtitle2: css`
    ${typography('subtitle2')}
  `,
  overline: css`
    ${typography('overline')}
  `,
  /* Styles applied to the root element if `variant="srOnly"`. Only accessible to screen readers. */
  srOnly: css`
    position: absolute;
    height: 1;
    width: 1;
    overflow: hidden;
  `,
  /* Styles applied to the root element if `align="left"`. */
  alignLeft: css`
    text-align: left;
  `,
  /* Styles applied to the root element if `align="center"`. */
  alignCenter: css`
    text-align: center;
  `,
  /* Styles applied to the root element if `align="right"`. */
  alignRight: css`
    text-align: right;
  `,
  /* Styles applied to the root element if `align="justify"`. */
  alignJustify: css`
    text-align: justify;
  `,
  /* Styles applied to the root element if `nowrap={true}`. */
  noWrap: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  /* Styles applied to the root element if `gutterBottom={true}`. */
  gutterBottom: css`
    margin-bottom: ${getVar('typography-gutter')};
  `,
  /* Styles applied to the root element if `paragraph={true}`. */
  paragraph: css`
    margin-bottom: ${getVar('typography-gutter')};
  `,
  /* Styles applied to the root element if `color="inherit"`. */
  colorInherit: css`
    color: inherit;
  `,
  /* Styles applied to the root element if `color="primary"`. */
  colorPrimary: css`
    color: ${getVar('palette-primary-main')};
  `,
  /* Styles applied to the root element if `color="secondary"`. */
  colorSecondary: css`
    color: ${getVar('palette-secondary-main')};
  `,
  /* Styles applied to the root element if `color="textPrimary"`. */
  colorTextPrimary: css`
    color: ${getVar('palette-text-primary')};
  `,
  /* Styles applied to the root element if `color="textSecondary"`. */
  colorTextSecondary: css`
    color: ${getVar('palette-text-secondary')};
  `,
  /* Styles applied to the root element if `color="error"`. */
  colorError: css`
    color: ${getVar('palette-error-main')};
  `,
  /* Styles applied to the root element if `display="inline"`. */
  displayInline: css`
    display: inline;
  `,
  /* Styles applied to the root element if `display="block"`. */
  displayBlock: css`
    display: block;
  `,
}

type VariantMapping = Record<TypographyVariant, React.ElementType>

const defaultVariantMapping: Partial<VariantMapping> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
}

export type TypographyClassKey = keyof typeof styles
export interface TypographyTypeMap<
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {},
  D extends React.ElementType = 'span',
> {
  props: P & {
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
    /**
     * The content of the component.
     */
    children?: React.ReactNode
    color?:
      | 'initial'
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'textPrimary'
      | 'textSecondary'
      | 'error'
    display?: 'initial' | 'block' | 'inline'
    gutterBottom?: boolean
    noWrap?: boolean
    paragraph?: boolean
    variant?: TypographyVariant | 'inherit'
    variantMapping?: Partial<VariantMapping>
  }
  defaultComponent: D
  classKey: TypographyClassKey
}

export type TypographyProps<
  D extends React.ElementType = TypographyTypeMap['defaultComponent'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {},
> = OverrideProps<TypographyTypeMap<P, D>, D>

const Typography = forwardRef<
  unknown,
  WithStyles<TypographyProps & { component?: React.ElementType }, typeof styles>
>(
  (
    {
      classes,
      align = 'inherit',
      color = 'initial',
      component,
      display = 'initial',
      gutterBottom = false,
      noWrap = false,
      paragraph = false,
      variant = 'body1',
      variantMapping = defaultVariantMapping,
      ...props
    },
    ref,
  ) => {
    const Component =
      component ||
      (paragraph
        ? 'p'
        : variant === 'inherit'
        ? 'span'
        : variantMapping[variant] || defaultVariantMapping[variant]) ||
      'span'

    return (
      // needs the never assertion since the compiler complains about union too large to represent
      // when we pass props as is
      <Component
        className={clsx(
          classes.root,
          variant !== 'inherit' && classes[variant],
          color !== 'initial' && classes[`color${capitalize(color)}`],
          align !== 'inherit' && classes[`align${capitalize(align)}`],
          display !== 'initial' && classes[`display${capitalize(display)}`],
          noWrap && classes.noWrap,
          gutterBottom && classes.gutterBottom,
          paragraph && classes.paragraph,
        )}
        ref={ref as never}
        {...props}
      />
    )
  },
)
Typography.displayName = 'Typography'

export default withStyles(styles, { name: 'Typography' })(
  Typography as any,
) as OverridableComponent<TypographyTypeMap>
