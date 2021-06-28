import React, { PropsWithChildren, ReactNode, useState } from 'react'
import { navigate } from 'gatsby'
import Typography from '@comps/typography'
import { shadowBorder, spacing } from '@styles/theme'
import { makeStyles } from '@material-ui/styles'
import { ClassesProp } from '@util/types'
import { clsx } from '@util/util'
import GLink from '@comps/GLink'

type Props = PropsWithChildren<{
  title: string
  link?: string
  footer?: ReactNode
}>

const useStyles = makeStyles(theme => ({
  flexContainerStyles: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardStyles: {
    cursor: 'pointer',
    padding: spacing(theme)(2),
    ...shadowBorder(theme),
    '&:hover': {
      ...shadowBorder(theme, { focused: true }),
    },
    '&:focus-within': {
      ...shadowBorder(theme, { focused: true }),
    },
    '& > * + *': {
      marginTop: spacing(theme)(2),
    },
  },
  textStyles: {
    flexGrow: 1,
    // we want text to be readable - optimal line length is 50-75 chars
    maxWidth: '70ch',
    // reuse some of the linkStyles for nested links
    '& a': {
      '&:focus, &:hover': { outline: 0, textDecoration: 'underline' },
      textDecoration: 'none',
    }
  },
  footerStyles: {
    marginTop: 'auto',
  },
  linkStyles: {
    '&:focus, &:hover': { outline: 0, textDecoration: 'underline' },
    textDecoration: 'none',
    color: 'inherit',
    '&:visited': { color: 'inherit' },
  },
  wordStyles: {
    wordBreak: 'break-word',
  },
}))

function isInteractiveElement(target: HTMLElement): boolean {
  const role = target.getAttribute('role')
  return role === 'button'
    || role === 'link'
    || role === 'checkbox'
    || role === 'form'
    || role === 'navigation'
    || role === 'search'
    || role === 'tab'
    || role === 'switch'
    || target.getAttribute('onclick') != null
    || target.getAttribute('href') != null
    || (HTMLInputElement && target instanceof HTMLInputElement)
    || (HTMLOptionElement && target instanceof HTMLOptionElement)
    || (HTMLDetailsElement && target instanceof HTMLDetailsElement)
    || target.classList.contains('aw-nested-interactive')
    // || (HTMLDialogElement && target instanceof HTMLDialogElement)
}

const Card = ({
  link,
  title,
  footer: footerContent,
  children,
  className,
  ...props
}: Props & ClassesProp<typeof useStyles>) => {
  const {
    flexContainerStyles,
    cardStyles,
    textStyles,
    footerStyles,
    linkStyles,
    wordStyles,
  } = useStyles(props)
  const [downTime, setTime] = useState(0)

  return (
    <article
      onMouseDown={e => {
        if (e.button !== 0) return
        setTime(e.timeStamp)
      }}
      onMouseUp={e => {
        if (e.button !== 0) return
        const timeDiff = e.timeStamp - downTime
        const interactive = e.target instanceof HTMLElement && isInteractiveElement(e.target)
        if (link && timeDiff < 200 && !interactive) {
          void navigate(link)
        }
      }}
      className={clsx(flexContainerStyles, cardStyles, className)}
      {...props}
    >
      <header className={wordStyles}>
        {link ? (
          <h2>
            <GLink variant="h5" className={linkStyles} to={link}>
              {title}
            </GLink>
          </h2>
        ) : (
          <Typography component="h2" variant="h5">
            {title}
          </Typography>
        )}
      </header>
      <div className={clsx(flexContainerStyles, textStyles, wordStyles)}>
        {children}
      </div>
      {footerContent && (
        <footer className={footerStyles}>{footerContent}</footer>
      )}
    </article>
  )
}

const useCardListStyles = makeStyles(theme => ({
  root: {
    listStyle: 'none',
    '& > li + li': {
      marginTop: spacing(theme)(3),
    },
    '@supports (display: grid)': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
      gap: spacing(theme)(3),
      '& > li + li': {
        marginTop: 0,
      },
    },
  },
  item: {
    '& > *': {
      height: '100%',
    },
  },
}))

export const CardList = <T,>({
  items,
  getKey,
  children: render,
  className,
  ...props
}: {
  items: T[]
  getKey: (t: T) => string | number
  children: (i: T) => React.ReactNode
} & ClassesProp<typeof useCardListStyles>) => {
  const classes = useCardListStyles(props)
  return (
    <ul className={clsx(className, classes.root)} {...props}>
      {items.map(i => (
        <li className={classes.item} key={getKey(i)}>
          {render(i)}
        </li>
      ))}
    </ul>
  )
}

export { Props as CardProps }
export default Card
