import { useTheme } from '@material-ui/styles'
import { Theme } from '@src/styles/theme/theme'
import { useEffect, useState } from 'react'

export default function useMediaQuery(
  input: string | ((theme: Theme) => string),
  options: {
    defaultMatches?: boolean
    matchMedia?: (query: string) => MediaQueryList
  } = {},
) {
  const theme = useTheme()

  // gets the query and removes @media and any trailing spaces
  const query = (typeof input === 'string' ? input : input(theme)).replace(
    /^@media +/m,
    '',
  )

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
