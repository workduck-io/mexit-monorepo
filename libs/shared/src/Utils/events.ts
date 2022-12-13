import { mog } from '@mexit/core'

const INPUT_TAGS = ['INPUT', 'TEXTAREA']

export const isOnEditableElement = (event: Event): boolean => {
  const target = event.target as HTMLElement

  if (!target) return false

  // mog('Is Element editable', { name: target.tagName })
  return INPUT_TAGS.includes(target.tagName) || target.isContentEditable
}

export const focusEditableElement = (target: HTMLElement): void => {
  if (target) {
    mog('Focusing Element')
    target.focus()
  }
}

export const blurEditableElement = (target: HTMLElement): void => {
  if (target) {
    target.blur()
  }
}
