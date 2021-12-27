/*
taken from material-ui
@see MUI_LICENSE
*/
import { useEffect, useLayoutEffect, useRef, useCallback } from 'react'

const useEnhancedEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 * @param {function} fn
 */
export default function useEventCallback<As extends unknown[], R>(
  fn: (...args: As) => R,
) {
  const ref = useRef(fn)
  useEnhancedEffect(() => {
    ref.current = fn
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useCallback((...args: As) => (0, ref.current)(...args), [])
}
