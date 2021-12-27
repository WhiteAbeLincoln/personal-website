/**
 * Override type system taken from material-ui
 * @see MUI_LICENSE
 */
import React from 'react'
import type { ClassesProp } from '@src/styles'

export type OverriddenComponent<M extends OverridableTypeMap> = <
  C extends React.ElementType,
>(
  props: {
    /**
     * The component used for the root node.
     * Either a string to use a HTML element or a component.
     */
    component: C
  } & OverrideProps<M, C>,
) => JSX.Element

export type DefaultComponent<M extends OverridableTypeMap> = (
  props: DefaultComponentProps<M>,
) => JSX.Element
/**
 * A component whose root component can be controlled via a `component` prop.
 *
 * Adjusts valid props based on the type of `component`.
 */
export type OverridableComponent<M extends OverridableTypeMap> =
  OverriddenComponent<M> & DefaultComponent<M>

/**
 * Props if `component={Component}` is NOT used.
 */
export type DefaultComponentProps<M extends OverridableTypeMap> = BaseProps<M> &
  Omit<React.ComponentPropsWithRef<M['defaultComponent']>, keyof BaseProps<M>>

export type OverridableTypeMap = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  props: {}
  defaultComponent: React.ElementType
  classKey: string
}

/**
 * Props that are valid for overridable components styled with material-ui/styles
 */
export type CommonProps<M extends OverridableTypeMap> = ClassesProp<
  M['classKey']
>

/**
 * Props defined on the component
 */
export type BaseProps<M extends OverridableTypeMap> = M['props'] &
  CommonProps<M>

export type OverrideProps<
  M extends OverridableTypeMap,
  C extends React.ElementType,
> = BaseProps<M> & Omit<React.ComponentPropsWithRef<C>, keyof CommonProps<M>>
