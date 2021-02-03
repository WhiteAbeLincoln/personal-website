/*
taken from material-ui
@see MUI_LICENSE
*/
import React from 'react'

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ref.current = value
  }
}

export default function useForkRef<T>(
  refA: React.Ref<T>,
  refB: React.Ref<T>,
): React.Ref<T> {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return React.useMemo(() => {
    if (refA == null && refB == null) {
      return null
    }
    return refValue => {
      setRef(refA, refValue)
      setRef(refB, refValue)
    }
  }, [refA, refB])
}
