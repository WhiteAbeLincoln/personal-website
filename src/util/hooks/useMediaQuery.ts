import { useEffect, useState } from 'react'
import { LayoutTheme, layoutTheme } from '@src/styles'

export default function useMediaQuery(
  input: string | ((theme: LayoutTheme) => string),
  options: {
    defaultMatches?: boolean
    matchMedia?: (query: string) => MediaQueryList
  } = {},
) {
  // gets the query and removes @media and any trailing spaces
  const query = (
    typeof input === 'string' ? input : input(layoutTheme)
  ).replace(/^@media +/m, '')

  const hasMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'

  const {
    defaultMatches = false,
    matchMedia = hasMatchMedia ? window.matchMedia : undefined,
  } = options

  const [match, setMatch] = useState(() => {
    if (matchMedia) {
      return matchMedia(query).matches
    }
    return defaultMatches
  })

  useEffect(() => {
    let active = true
    if (!matchMedia) {
      return undefined
    }
    const queryList = matchMedia(query)
    const updateMatch = () => {
      if (active) {
        setMatch(queryList.matches)
      }
    }
    updateMatch()
    queryList.addEventListener('change', updateMatch)
    return () => {
      active = false
      queryList.removeEventListener('change', updateMatch)
    }
  })

  return match
}
