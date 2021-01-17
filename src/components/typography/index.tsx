import { TypographyVariant } from '@comps/theme/Theme'
import styled from '@emotion/styled'
import React, { forwardRef, PropsWithChildren } from 'react'

const shouldForwardProp = (prop: PropertyKey) =>
  prop !== 'theme' && prop !== 'as' && prop !== 'styleProps'
const TypographyRoot = styled('span', { shouldForwardProp })(
  ({ theme, ...prps }) => {
    const { styleProps: props } = prps as { styleProps: StyleProps }
    console.log(props)
    return {
      margin: 0,
      ...(props.variant && theme.typography[props.variant]),
      ...(props.noWrap && {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }),
      ...(props.gutterBottom && {
        marginBottom: theme.typography.gutter,
      }),
      ...(props.paragraph && {
        marginBottom: 16,
      }),
    }
  },
)

type VariantMapping = Record<TypographyVariant, React.ElementType>

const defaultVariantMapping: VariantMapping = {
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
  caption: 'span',
  overline: 'span',
  button: 'span',
}

// {} intersected with an object is the object
// eslint-disable-next-line @typescript-eslint/ban-types
type Props = PropsWithChildren<{
  variant?: TypographyVariant
  variantMapping?: Partial<VariantMapping>
  component?: React.ElementType
  paragraph?: boolean
  gutterBottom?: boolean
  noWrap?: boolean
}>
type StyleProps = Pick<
  Props,
  'variant' | 'paragraph' | 'gutterBottom' | 'noWrap'
>

const Typography = forwardRef<unknown, Props>(
  (
    {
      variant = 'body1',
      variantMapping = defaultVariantMapping,
      component,
      paragraph,
      gutterBottom,
      children,
      ...props
    },
    ref,
  ) => {
    const Component =
      component ||
      (paragraph
        ? 'p'
        : variantMapping[variant] || defaultVariantMapping[variant]) ||
      'span'
    const styleProps: StyleProps = {
      variant,
      gutterBottom,
      paragraph,
    }
    // needs the never assertion since the compiler complains about union too large to represent
    // when we pass props as is
    const prop = {
      ref,
      children,
      styleProps,
      ...props,
    } as never
    return <TypographyRoot ref={ref} as={Component} {...prop} />
  },
)

export default Typography
export { Props as TypographyProps }
