import { css } from '@linaria/core'
import { navigate } from 'gatsby'
import React, { PropsWithChildren, ReactNode, useState } from 'react'
import GLink from '@src/components/GLink'
import Typography from '@src/components/typography'
import {
  ClassesProp,
  clsx,
  getVar,
  makeStyles,
  shadowBorder,
  withStyles,
  spacing,
} from '@src/styles'
import { capitalize } from '@src/util'

type Props = PropsWithChildren<{
  title: string
  link?: string
  footer?: ReactNode
  color?: 'primary' | 'secondary'
}>

const cardStyles = {
  root: css`
    cursor: pointer;
    padding: ${spacing(2)};
    ${shadowBorder.base}
    &:focus-within, &:hover {
      ${shadowBorder.focused}
    }
    & > * + * {
      margin-top: ${spacing(2)};
    }
  `,
  flexContainer: css`
    display: flex;
    flex-direction: column;
  `,
  colorPrimary: css`
    color: ${getVar('palette-primary-main')};
  `,
  colorSecondary: css`
    color: ${getVar('palette-primary-main')};
  `,
  text: css`
    flex-grow: 1;
    max-width: 70ch;
  `,
  footer: css`
    margin-top: auto;
  `,
  link: css`
    &:focus,
    &:hover {
      outline: 0;
      text-decoration: underline;
    }
    text-decoration: none;
    color: inherit;
    &:visited {
      color: inherit;
    }
  `,
  word: css`
    word-break: break-word;
  `,
}

function isInteractiveElement(target: HTMLElement): boolean {
  const role = target.getAttribute('role')
  return (
    role === 'button' ||
    role === 'link' ||
    role === 'checkbox' ||
    role === 'form' ||
    role === 'navigation' ||
    role === 'search' ||
    role === 'tab' ||
    role === 'switch' ||
    target.getAttribute('onclick') != null ||
    target.getAttribute('href') != null ||
    (HTMLInputElement && target instanceof HTMLInputElement) ||
    (HTMLOptionElement && target instanceof HTMLOptionElement) ||
    (HTMLDetailsElement && target instanceof HTMLDetailsElement) ||
    target.classList.contains('aw-nested-interactive')
  )
  // || (HTMLDialogElement && target instanceof HTMLDialogElement)
}

export default withStyles(cardStyles)<Props>(function Card({
  link,
  title,
  footer: footerContent,
  children,
  color = 'primary',
  classes,
  ...props
}) {
  const [downTime, setTime] = useState(0)

  return (
    <article
      onMouseDown={
        link
          ? e => {
              if (e.button !== 0) return
              setTime(e.timeStamp)
            }
          : undefined
      }
      onMouseUp={
        link
          ? e => {
              if (e.button !== 0) return
              const timeDiff = e.timeStamp - downTime
              const interactive =
                e.target instanceof HTMLElement &&
                isInteractiveElement(e.target)
              if (link && timeDiff < 200 && !interactive) {
                void navigate(link)
              }
            }
          : undefined
      }
      className={clsx(
        classes.root,
        classes.flexContainer,
        classes[`color${capitalize(color)}`],
      )}
      {...props}
    >
      <header className={classes.word}>
        {link ? (
          <h2>
            <GLink
              variant="h5"
              className={classes.link}
              underline="hover"
              to={link}
            >
              {title}
            </GLink>
          </h2>
        ) : (
          <Typography component="h2" variant="h5">
            {title}
          </Typography>
        )}
      </header>
      <div className={clsx(classes.flexContainer, classes.text, classes.word)}>
        {children}
      </div>
      {footerContent && (
        <footer className={classes.footer}>{footerContent}</footer>
      )}
    </article>
  )
})

const useCardListStyles = makeStyles({
  root: css`
    list-style: none;
    & > li + li {
      margin-top: ${spacing(3)};
    }
    @supports (display: grid) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
      gap: ${spacing(3)};
      & > li + li {
        margin-top: 0;
      }
    }
  `,
  item: css`
    & > * {
      height: 100%;
    }
  `,
})

export const CardList = <T,>(
  props: {
    items: T[]
    getKey: (t: T) => string | number
    children: (i: T) => React.ReactNode
  } & ClassesProp<typeof useCardListStyles>,
) => {
  const {
    items,
    getKey,
    children: render,
    classes,
    ...rest
  } = useCardListStyles(props)

  return (
    <ul className={classes.root} {...rest}>
      {items.map(i => (
        <li className={classes.item} key={getKey(i)}>
          {render(i)}
        </li>
      ))}
    </ul>
  )
}

export { Props as CardProps }
