/*
 * Taken from material-ui
 * @see MUI_LICENSE
 */
import React, { forwardRef } from 'react'
import { Theme, TypographyVariant } from '@styles/theme'
import { createStyles, withStyles } from '@material-ui/styles'
import { capitalize, clsx } from '@util/util'
import {
  OverridableComponent,
  OverrideProps,
} from '@util/types/OverridableComponent'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
    },
    body2: theme.typography.body2,
    body1: theme.typography.body1,
    caption: theme.typography.caption,
    button: theme.typography.button,
    display: theme.typography.display,
    h1: theme.typography.h1,
    h2: theme.typography.h2,
    h3: theme.typography.h3,
    h4: theme.typography.h4,
    h5: theme.typography.h5,
    h6: theme.typography.h6,
    subtitle1: theme.typography.subtitle1,
    subtitle2: theme.typography.subtitle2,
    overline: theme.typography.overline,
    /* Styles applied to the root element if `variant="srOnly"`. Only accessible to screen readers. */
    srOnly: {
      position: 'absolute',
      height: 1,
      width: 1,
      overflow: 'hidden',
    },
    /* Styles applied to the root element if `align="left"`. */
    alignLeft: {
      textAlign: 'left',
    },
    /* Styles applied to the root element if `align="center"`. */
    alignCenter: {
      textAlign: 'center',
    },
    /* Styles applied to the root element if `align="right"`. */
    alignRight: {
      textAlign: 'right',
    },
    /* Styles applied to the root element if `align="justify"`. */
    alignJustify: {
      textAlign: 'justify',
    },
    /* Styles applied to the root element if `nowrap={true}`. */
    noWrap: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    /* Styles applied to the root element if `gutterBottom={true}`. */
    gutterBottom: {
      marginBottom: theme.typography.gutter,
    },
    /* Styles applied to the root element if `paragraph={true}`. */
    paragraph: {
      marginBottom: theme.typography.gutter,
    },
    /* Styles applied to the root element if `color="inherit"`. */
    colorInherit: {
      color: 'inherit',
    },
    /* Styles applied to the root element if `color="primary"`. */
    colorPrimary: {
      color: theme.palette.primary.main,
    },
    /* Styles applied to the root element if `color="secondary"`. */
    colorSecondary: {
      color: theme.palette.secondary.main,
    },
    /* Styles applied to the root element if `color="textPrimary"`. */
    colorTextPrimary: {
      color: theme.palette.text.primary,
    },
    /* Styles applied to the root element if `color="textSecondary"`. */
    colorTextSecondary: {
      color: theme.palette.text.secondary,
    },
    /* Styles applied to the root element if `color="error"`. */
    colorError: {
      color: theme.palette.error.main,
    },
    /* Styles applied to the root element if `display="inline"`. */
    displayInline: {
      display: 'inline',
    },
    /* Styles applied to the root element if `display="block"`. */
    displayBlock: {
      display: 'block',
    },
  })

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

export type TypographyClassKey = keyof ReturnType<typeof styles>
export interface TypographyTypeMap<
  P = {},
  D extends React.ElementType = 'span'
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
  P = {}
> = OverrideProps<TypographyTypeMap<P, D>, D>

const Typography = forwardRef<
  unknown,
  TypographyProps & { component?: React.ElementType }
>(
  (
    {
      classes = {},
      className,
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
          color !== 'initial' && classes[`color${capitalize(color)}` as const],
          align !== 'inherit' && classes[`align${capitalize(align)}` as const],
          display !== 'initial' &&
            classes[`display${capitalize(display)}` as const],
          noWrap && classes.noWrap,
          gutterBottom && classes.gutterBottom,
          paragraph && classes.paragraph,
          className,
        )}
        ref={ref as never}
        {...props}
      />
    )
  },
)

export default withStyles(styles, { name: 'Typography' })(
  Typography,
) as OverridableComponent<TypographyTypeMap>
