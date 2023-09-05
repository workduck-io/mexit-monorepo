//@ts-nocheck
import { nice } from './niceTry'

export const isExtension = () =>
  nice(
    () => window.chrome && chrome.runtime && chrome.runtime.id,
    (err) => false
  )

export const getElementById = (id: string) => {
  if (!isExtension()) return document.getElementById(id)
  return document.getElementById('mexit').shadowRoot.getElementById(id)
}
