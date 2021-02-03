/*
taken from material-ui
@see MUI_LICENSE
*/
import React from 'react'

const useEnhancedEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 * @param {function} fn
 */
export default function useEventCallback<As extends any[], R>(
  fn: (...args: As) => R,
) {
  const ref = React.useRef(fn)
  useEnhancedEffect(() => {
    ref.current = fn
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return React.useCallback((...args: As) => (0, ref.current)(...args), [])
}
