/*
Taken from material-ui
@see MUI_LICENSE
*/
// based on https://github.com/WICG/focus-visible/blob/v4.1.5/src/focus-visible.js
import { has } from '@util/functional/predicates'
import React from 'react'
import ReactDOM from 'react-dom'

let hadKeyboardEvent = true
let hadFocusVisibleRecently = false
let hadFocusVisibleRecentlyTimeout: number | undefined = undefined

const inputTypesWhitelist: Record<string, boolean | undefined> = {
  text: true,
  search: true,
  url: true,
  tel: true,
  email: true,
  password: true,
  number: true,
  date: true,
  month: true,
  week: true,
  time: true,
  datetime: true,
  'datetime-local': true,
}

type ElementUnion = HTMLElementTagNameMap[keyof HTMLElementTagNameMap]

/**
 * Computes whether the given element should automatically trigger the
 * `focus-visible` class being added, i.e. whether it should always match
 * `:focus-visible` when focused.
 * @param {Element} node
 * @return {boolean}
 */
function focusTriggersKeyboardModality(node: ElementUnion) {
  const { tagName } = node
  const type = has(node, 'type', 'string') ? node.type : undefined
  const readOnly = has(node, 'readOnly', 'boolean') ? node.readOnly : undefined

  if (tagName === 'INPUT' && type && inputTypesWhitelist[type] && !readOnly) {
    return true
  }

  if (tagName === 'TEXTAREA' && !readOnly) {
    return true
  }

  if (node.isContentEditable) {
    return true
  }

  return false
}

/**
 * Keep track of our keyboard modality state with `hadKeyboardEvent`.
 * If the most recent user interaction was via the keyboard;
 * and the key press did not include a meta, alt/option, or control key;
 * then the modality is keyboard. Otherwise, the modality is not keyboard.
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event: KeyboardEvent) {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return
  }
  hadKeyboardEvent = true
}

/**
 * If at any point a user clicks with a pointing device, ensure that we change
 * the modality away from keyboard.
 * This avoids the situation where a user presses a key on an already focused
 * element, and then clicks on a different element, focusing it with a
 * pointing device, while we still think we're in keyboard modality.
 */
function handlePointerDown() {
  hadKeyboardEvent = false
}

function handleVisibilityChange(this: Document) {
  if (this.visibilityState === 'hidden') {
    // If the tab becomes active again, the browser will handle calling focus
    // on the element (Safari actually calls it twice).
    // If this tab change caused a blur on an element with focus-visible,
    // re-apply the class when the user switches back to the tab.
    if (hadFocusVisibleRecently) {
      hadKeyboardEvent = true
    }
  }
}

function prepare(doc: Document) {
  doc.addEventListener('keydown', handleKeyDown, true)
  doc.addEventListener('mousedown', handlePointerDown, true)
  doc.addEventListener('pointerdown', handlePointerDown, true)
  doc.addEventListener('touchstart', handlePointerDown, true)
  doc.addEventListener('visibilitychange', handleVisibilityChange, true)
}

export function teardown(doc: Document) {
  doc.removeEventListener('keydown', handleKeyDown, true)
  doc.removeEventListener('mousedown', handlePointerDown, true)
  doc.removeEventListener('pointerdown', handlePointerDown, true)
  doc.removeEventListener('touchstart', handlePointerDown, true)
  doc.removeEventListener('visibilitychange', handleVisibilityChange, true)
}

function isFocusVisible(event: { target: Element }) {
  const { target } = event
  try {
    if (target) {
      return target.matches(':focus-visible')
    }
  } catch (error) {
    // browsers not implementing :focus-visible will throw a SyntaxError
    // we use our own heuristic for those browsers
    // rethrow might be better if it's not the expected error but do we really
    // want to crash if focus-visible malfunctioned?
  }

  // no need for validFocusTarget check. the user does that by attaching it to
  // focusable events only
  return (
    hadKeyboardEvent || focusTriggersKeyboardModality(target as ElementUnion)
  )
}

/**
 * Should be called if a blur event is fired on a focus-visible element
 */
function handleBlurVisible() {
  // To detect a tab/window switch, we look for a blur event followed
  // rapidly by a visibility change.
  // If we don't see a visibility change within 100ms, it's probably a
  // regular focus change.
  hadFocusVisibleRecently = true
  window.clearTimeout(hadFocusVisibleRecentlyTimeout)
  hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
    hadFocusVisibleRecently = false
  }, 100)
}
/**
 * Provides a polyfill for the :focus-visible css selector
 */
export default function useIsFocusVisible() {
  const ref = React.useCallback(
    (instance: React.ReactInstance | null | undefined) => {
      const node = ReactDOM.findDOMNode(instance)
      if (node != null) {
        prepare(node.ownerDocument)
      }
    },
    [],
  )

  if (process.env.NODE_ENV !== 'production') {
    React.useDebugValue(isFocusVisible)
  }

  return { isFocusVisible, onBlurVisible: handleBlurVisible, ref }
}
