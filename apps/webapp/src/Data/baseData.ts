import {
  BASE_DRAFT_PATH,
  NodeContent,
  ELEMENT_PARAGRAPH,
  generateNodeUID,
  generateTempId,
  ILink,
  Contents
} from '@mexit/core'

import { PersistentData } from './../Types/Data'

import { initialSnippets } from './initData/snippets'
import { onboardingContent } from './initData/onboardingDoc'
import { draftContent } from './initData/draftDoc'

export const generateIlink = (path: string): ILink => ({
  path,
  nodeid: generateNodeUID()
})

export const generateILinks = (items: string[]) => items.map(generateIlink)

const links = generateILinks(['doc', 'dev', 'design', '@'])

export const onboardingLink = {
  path: 'Onboarding',
  nodeid: generateNodeUID()
}

const draftLink = {
  path: BASE_DRAFT_PATH,
  nodeid: generateNodeUID(),
  icon: 'ri:draft-line'
}

const linksWithSpecialContent = [onboardingLink, draftLink]

export const defaultContent: NodeContent = {
  type: 'init',
  content: [{ id: generateTempId(), type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
  version: -1
}

export const generateDefaultNode = (): NodeContent => {
  return {
    type: 'init',
    content: [{ id: generateTempId(), type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
    version: -1
  }
}

const contents: Contents = links.reduce(
  (prev, cur) => {
    return {
      ...prev,
      [cur.nodeid]: generateDefaultNode()
    }
  },
  {
    [onboardingLink.nodeid]: onboardingContent,
    [draftLink.nodeid]: draftContent
  }
)

export const DefaultPersistentData: PersistentData = {
  baseNodeId: '@',

  ilinks: [...linksWithSpecialContent, ...links],
  tags: [{ id: '1', text: 'mex' }],

  contents,

  linkCache: {},
  tagsCache: {},

  archive: [],
  bookmarks: [],

  todos: {},
  reminders: [],
  snippets: []
}
