import { mog } from '@mexit/core'

const INPUT_FIELDS = ['input', 'textarea']
const INPUT_TAGS = [...INPUT_FIELDS, '#text']

export const isOnEditableElement = (event: Event): boolean => {
  const target = event.target as HTMLElement
  return isInputElement(target) || target.isContentEditable
}

export const isInputElement = (element: any) => {
  if (!element) return false
  return INPUT_TAGS.includes(element.nodeName.toLowerCase())
}

export const isInputField = (element): boolean => {
  if (!element) return false
  return INPUT_FIELDS.includes(element.nodeName.toLowerCase())
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
