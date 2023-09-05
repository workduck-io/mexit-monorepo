import { DRAFT_NODE, DRAFT_PREFIX, PROFILE_PREFIX, SEPARATOR } from './idGenerator'
import { getCurrentTimeString } from './time'

export const getNewDraftKey = (): string => {
  // Mar 16, 2022 10:24:29 PM
  const currentTime: string = getCurrentTimeString('PPpp')

  return `${DRAFT_PREFIX}${SEPARATOR}${currentTime}`
}

export const getProfileNoteKey = (title: string) => {
  return `${PROFILE_PREFIX}${SEPARATOR}${title}`
}

export const getUntitledDraftKey = (): string => {
  return `${DRAFT_PREFIX}${SEPARATOR}${DRAFT_NODE}`
}

export const getUntitledKey = (parent: string): string => {
  return `${parent}${SEPARATOR}${DRAFT_NODE}`
}
