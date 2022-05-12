import { DRAFT_PREFIX, SEPARATOR, DRAFT_NODE } from './idGenerator'
import { getCurrentTimeString } from './time'

export const getNewDraftKey = (): string => {
  // Mar 16, 2022 10:24:29 PM
  const currentTime: string = getCurrentTimeString('PPpp')

  return `${DRAFT_PREFIX}${SEPARATOR}${currentTime}`
}

export const getUntitledDraftKey = (): string => {
  return `${DRAFT_PREFIX}${SEPARATOR}${DRAFT_NODE}`
}
