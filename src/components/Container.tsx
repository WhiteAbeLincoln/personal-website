/*
 * Adapted from material-ui
 * @see MUI_LICENSE
 */
import { css, CSSProperties as CSSProps } from '@linaria/core'
import React, { forwardRef } from 'react'
import {
  BreakpointKey,
  spacing,
  bp_gt,
  layoutTheme,
  clsx,
  withStyles,
  WithStyles,
} from '@src/styles'
import { capitalize, entries } from '@src/util'
import {
  OverridableComponent,
  OverrideProps,
} from '@src/util/types/OverridableComponent'

const styles = {
  /* Styles applied to the root element. */
  root: css`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    padding-left: ${spacing(2)};
    padding-right: ${spacing(2)};
    display: block;
    ${bp_gt('sm')} {
      padding-left: ${spacing(3)};
      padding-right: ${spacing(3)};
    }
  `,
  /* Styles applied to the root element if `disableGutters={true}`. */
  disableGutters: css`
    padding-left: 0;
    padding-right: 0;
  `,
  /* Styles applied to the root element if `fixed={true}`. */
  fixed: css`
    ${entries(layoutTheme.breakpoints.values).reduce((acc, [key, value]) => {
    if (value !== 0) {
      acc[bp_gt(key)] = { maxWidth: value }
    }
    return acc
  }, {} as CSSProps)}
  `,
  /* Styles applied to the root element if `maxWidth="xs"`. */
  maxWidthXs: css`
    ${bp_gt('xs')} {
      max-width: ${Math.max(layoutTheme.breakpoints.values.xs, 444)}${layoutTheme.breakpoints.unit};
    }
  `,
  /* Styles applied to the root element if `maxWidth="sm"`. */
  maxWidthSm: css`
    ${bp_gt('sm')} {
      max-width: ${layoutTheme.breakpoints.values.sm}${layoutTheme.breakpoints.unit};
    }
  `,
  /* Styles applied to the root element if `maxWidth="md"`. */
  maxWidthMd: css`
    ${bp_gt('md')} {
      max-width: ${layoutTheme.breakpoints.values.md}${layoutTheme.breakpoints.unit};
    }
  `,
  /* Styles applied to the root element if `maxWidth="lg"`. */
  maxWidthLg: css`
    ${bp_gt('lg')} {
      max-width: ${layoutTheme.breakpoints.values.lg}${layoutTheme.breakpoints.unit};
    }
  `,
  /* Styles applied to the root element if `maxWidth="xl"`. */
  maxWidthXl: css`
    ${bp_gt('xl')} {
      max-width: ${layoutTheme.breakpoints.values.xl}${layoutTheme.breakpoints.unit};
    }
  `,
}

export type ContainerClassKey = keyof typeof styles
// eslint-disable-next-line @typescript-eslint/ban-types
export type ContainerClassesProps = {}
// eslint-disable-next-line @typescript-eslint/ban-types
export interface ContainerTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    children: NonNullable<React.ReactNode>
    /**
     * If `true`, the left and right padding is removed.
     */
    disableGutters?: boolean
    /**
     * Set the max-width to match the min-width of the current breakpoint.
     * This is useful if you'd prefer to design for a fixed set of sizes
     * instead of trying to accommodate a fully fluid viewport.
     * It's fluid by default.
     */
    fixed?: boolean
    /**
     * Determine the max-width of the container.
     * The container width grows with the size of the screen.
     * Set to `false` to disable `maxWidth`.
     */
    maxWidth?: BreakpointKey | false
  }
  defaultComponent: D
  classKey: ContainerClassKey
}
export type ContainerProps<
  D extends React.ElementType = ContainerTypeMap['defaultComponent'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {},
  > = OverrideProps<ContainerTypeMap<P, D>, D>

const Container = forwardRef<
  unknown,
  WithStyles<ContainerProps & { component?: React.ElementType }, typeof styles>
>(function Container(props, ref) {
  const {
    classes,
    component: Component = 'div',
    disableGutters = false,
    fixed = false,
    maxWidth = 'lg',
    ...other
  } = props

  return (
    <Component
      className={clsx(
        classes.root,
        maxWidth !== false && classes[`maxWidth${capitalize(maxWidth)}`],
        fixed && classes.fixed,
        disableGutters && classes.disableGutters,
      )}
      ref={ref}
      {...other}
    />
  )
})

export default withStyles(styles, { name: 'Container' })(
  Container as any,
) as OverridableComponent<ContainerTypeMap>
