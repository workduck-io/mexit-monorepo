//@ts-nocheck
import { nice } from './niceTry'

export const isExtension = () =>
  nice(
    () => window.chrome && chrome.runtime && chrome.runtime.id,
    (err) => false
  )
