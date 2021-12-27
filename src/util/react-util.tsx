import React, {
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  ComponentPropsWithoutRef,
} from 'react'
import { has } from './functional/predicates'
import { MakePartial } from './types'
import {
  OverridableComponent,
  OverridableTypeMap,
  OverrideProps,
} from './types/OverridableComponent'
import { clsx } from '@src/styles'

export function partial<
  M extends OverridableTypeMap,
  Comp extends React.ElementType,
  K extends keyof Props,
  Props extends OverrideProps<M, Comp> = OverrideProps<M, Comp>,
>(
  Comp: OverridableComponent<M>,
  pprops: { component: Comp } & Pick<Props, K>,
): (props: MakePartial<Props, K>) => JSX.Element | null
export function partial<
  E extends React.ElementType | OverridableComponent<OverridableTypeMap>,
  K extends keyof Props,
  Props extends ComponentPropsWithoutRef<E> = ComponentPropsWithoutRef<E>,
>(
  Comp: E,
  pprops: Pick<Props, K>,
): (props: MakePartial<Props, K>) => JSX.Element | null
export function partial<
  E extends React.ElementType | OverridableComponent<OverridableTypeMap>,
  K extends keyof Props,
  Props extends ComponentPropsWithoutRef<E> = ComponentPropsWithoutRef<E>,
>(
  Comp: E,
  pprops: Pick<Props, K>,
): ForwardRefExoticComponent<
  PropsWithoutRef<MakePartial<Props, K>> & RefAttributes<unknown>
> {
  const className = has(pprops, 'className', 'string')
    ? pprops.className
    : undefined

  const comp = forwardRef((props: MakePartial<Props, K>, ref) => {
    const allProps = { ...pprops, ...props } as Props
    if (className && has(allProps, 'className', 'string')) {
      allProps.className = clsx(className, allProps.className)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Comp ref={ref} {...(allProps as any)} />
  })
  comp.displayName = `Partial(${
    typeof Comp === 'string'
      ? Comp
      : (Comp as Exclude<React.ElementType, string | symbol>).displayName ??
        'unnamed'
  })`
  return comp
}
