/*
 * Taken from material-ui
 * @see MUI_LICENSE
 */
import React from 'react'
import { bp_gt, BreakpointKey, spacing, Theme } from '@styles/theme'
import { createStyles, CSSProperties, withStyles } from '@material-ui/styles'
import { capitalize, clsx, entries } from '@util/util'
import {
  OverridableComponent,
  OverrideProps,
} from '@util/types/OverridableComponent'

export const styles = (theme: Theme) =>
  createStyles({
    /* Styles applied to the root element. */
    root: {
      width: '100%',
      marginLeft: 'auto',
      boxSizing: 'border-box',
      marginRight: 'auto',
      paddingLeft: spacing(theme)(2),
      paddingRight: spacing(theme)(2),
      display: 'block', // Fix IE 11 layout when used with main.
      [bp_gt('sm')(theme)]: {
        paddingLeft: spacing(theme)(3),
        paddingRight: spacing(theme)(3),
      },
    },
    /* Styles applied to the root element if `disableGutters={true}`. */
    disableGutters: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    /* Styles applied to the root element if `fixed={true}`. */
    fixed: entries(theme.breakpoints.values).reduce((acc, [key, value]) => {
      if (value !== 0) {
        acc[bp_gt(key)(theme)] = { maxWidth: value }
      }
      return acc
    }, {} as CSSProperties),
    /* Styles applied to the root element if `maxWidth="xs"`. */
    maxWidthXs: {
      [bp_gt('xs')(theme)]: {
        maxWidth: Math.max(theme.breakpoints.values.xs, 444),
      },
    },
    /* Styles applied to the root element if `maxWidth="sm"`. */
    maxWidthSm: {
      [bp_gt('sm')(theme)]: {
        maxWidth: theme.breakpoints.values.sm,
      },
    },
    /* Styles applied to the root element if `maxWidth="md"`. */
    maxWidthMd: {
      [bp_gt('md')(theme)]: {
        maxWidth: theme.breakpoints.values.md,
      },
    },
    /* Styles applied to the root element if `maxWidth="lg"`. */
    maxWidthLg: {
      [bp_gt('lg')(theme)]: {
        maxWidth: theme.breakpoints.values.lg,
      },
    },
    /* Styles applied to the root element if `maxWidth="xl"`. */
    maxWidthXl: {
      [bp_gt('xl')(theme)]: {
        maxWidth: theme.breakpoints.values.xl,
      },
    },
  })

export type ContainerClassKey = keyof ReturnType<typeof styles>
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
  P = {}
> = OverrideProps<ContainerTypeMap<P, D>, D>

const Container = React.forwardRef<
  unknown,
  ContainerProps & { component?: React.ElementType }
>(function Container(props, ref) {
  const {
    classes = {},
    className,
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
        maxWidth !== false &&
          classes[`maxWidth${capitalize(maxWidth)}` as const],
        fixed && classes.fixed,
        disableGutters && classes.disableGutters,
        className,
      )}
      ref={ref}
      {...other}
    />
  )
})

export default withStyles(styles, { name: 'Container' })(
  Container,
) as OverridableComponent<ContainerTypeMap>
