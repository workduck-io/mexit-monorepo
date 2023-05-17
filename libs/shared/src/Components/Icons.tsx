// Icons for sidebar and UI
import React from 'react'

import editLine from '@iconify/icons-ri/edit-line'
import linkUnlinkM from '@iconify/icons-ri/link-unlink-m'
import { addIcon } from '@iconify/react'
import arrowDownCircleLine from '@iconify-icons/ri/arrow-down-circle-line'
import checkboxBlankCircleFill from '@iconify-icons/ri/checkbox-blank-circle-fill'
import checkboxBlankCircleLine from '@iconify-icons/ri/checkbox-blank-circle-line'
import draftFill from '@iconify-icons/ri/draft-fill'
import draftLine from '@iconify-icons/ri/draft-line'
// Icons for Editor
import externalLinkLine from '@iconify-icons/ri/external-link-line'
import starFill from '@iconify-icons/ri/star-fill'
import starLine from '@iconify-icons/ri/star-line'
import taskFill from '@iconify-icons/ri/task-fill'
import taskLine from '@iconify-icons/ri/task-line'
import { useTheme } from 'styled-components'

import { MIcon } from '@mexit/core'

// `any` is used in type signature as `IconifyIcon` type doesn't work

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const MexIcons: { [key: string]: [any, any] } = {
  // First element of array is of closed Icon and the second is for open
  openClose: [checkboxBlankCircleFill, arrowDownCircleLine],
  circle: [checkboxBlankCircleFill, checkboxBlankCircleLine],
  pursuits: [starFill, starLine],
  starred: [starFill, starLine],
  tasks: [taskFill, taskLine],
  drafts: [draftFill, draftLine]
}

export const MexNodeIcons: { [key: string]: [any, any] } = {
  'ri:task-line': [taskFill, taskLine],
  'ri:draft-line': [draftFill, draftLine]
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const EditorIcons: { [name: string]: any } = {
  externalLink: externalLinkLine,
  text: 'icon-park-outline:add-text',
  edit: editLine,
  linkUnlink: linkUnlinkM
}

type SharedNodeIconProps = {
  fill?: string
  height?: number
  width?: number
  margin?: string
}

export const SharedNodeIconify = {
  height: 24,
  width: 24,
  body: `
    <path fill="currentColor" d="M4 22C3.73478 22 3.48043 21.8946 3.29289 21.7071C3.10536 21.5196 3 21.2652 3 21V3C3 2.73478 3.10536 2.48043 3.29289 2.29289C3.48043 2.10536 3.73478 2 4 2H20C20.2652 2 20.5196 2.10536 20.7071 2.29289C20.8946 2.48043 21 2.73478 21 3V9L19 7.5V4H5V20H11.5L15 22H4Z" />
    <path fill="currentColor" d="M8 7V9H14L15.5 7H8Z" />
    <path fill="currentColor" d="M7.9947 10.9931L8 13H9.5L11.5 11L7.9947 10.9931Z" />
    <path fill="currentColor" d="M16.5386 19.7171L13.2456 17.9211C12.9296 18.2349 12.5276 18.448 12.0906 18.5337C11.6535 18.6194 11.2009 18.5738 10.7897 18.4026C10.3786 18.2314 10.0273 17.9423 9.7802 17.5717C9.53311 17.2012 9.40125 16.7658 9.40125 16.3204C9.40125 15.875 9.53311 15.4396 9.7802 15.069C10.0273 14.6985 10.3786 14.4094 10.7897 14.2382C11.2009 14.067 11.6535 14.0214 12.0906 14.1071C12.5276 14.1927 12.9296 14.4059 13.2456 14.7197L16.5386 12.9237C16.4257 12.3938 16.5072 11.841 16.7684 11.3663C17.0296 10.8916 17.4529 10.5268 17.9609 10.3385C18.4689 10.1503 19.0278 10.1512 19.5352 10.3412C20.0426 10.5311 20.4646 10.8973 20.7242 11.3728C20.9838 11.8484 21.0636 12.4015 20.9489 12.931C20.8342 13.4605 20.5327 13.931 20.0996 14.2565C19.6665 14.582 19.1307 14.7407 18.5902 14.7037C18.0497 14.6666 17.5406 14.4362 17.156 14.0546L13.863 15.8506C13.9287 16.1603 13.9287 16.4804 13.863 16.7902L17.156 18.5861C17.5406 18.2046 18.0497 17.9742 18.5902 17.9371C19.1307 17.9 19.6665 18.0588 20.0996 18.3843C20.5327 18.7098 20.8342 19.1803 20.9489 19.7098C21.0636 20.2393 20.9838 20.7924 20.7242 21.2679C20.4646 21.7435 20.0426 22.1097 19.5352 22.2996C19.0278 22.4895 18.4689 22.4905 17.9609 22.3022C17.4529 22.114 17.0296 21.7492 16.7684 21.2745C16.5072 20.7998 16.4257 20.247 16.5386 19.7171Z" />`
}

export const SharedNodeIcon: React.FC<SharedNodeIconProps> = ({ fill, margin = '0', height = 24, width = 24 }) => {
  const theme = useTheme()

  const fillColor = fill || theme.colors.text.default

  return (
    <svg
      width={`${width}`}
      style={{ margin }}
      height={`${height}`}
      viewBox="0 0 24 24"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 22C3.73478 22 3.48043 21.8946 3.29289 21.7071C3.10536 21.5196 3 21.2652 3 21V3C3 2.73478 3.10536 2.48043 3.29289 2.29289C3.48043 2.10536 3.73478 2 4 2H20C20.2652 2 20.5196 2.10536 20.7071 2.29289C20.8946 2.48043 21 2.73478 21 3V9L19 7.5V4H5V20H11.5L15 22H4Z" />
      <path d="M8 7V9H14L15.5 7H8Z" />
      <path d="M7.9947 10.9931L8 13H9.5L11.5 11L7.9947 10.9931Z" />
      <path d="M16.5386 19.7171L13.2456 17.9211C12.9296 18.2349 12.5276 18.448 12.0906 18.5337C11.6535 18.6194 11.2009 18.5738 10.7897 18.4026C10.3786 18.2314 10.0273 17.9423 9.7802 17.5717C9.53311 17.2012 9.40125 16.7658 9.40125 16.3204C9.40125 15.875 9.53311 15.4396 9.7802 15.069C10.0273 14.6985 10.3786 14.4094 10.7897 14.2382C11.2009 14.067 11.6535 14.0214 12.0906 14.1071C12.5276 14.1927 12.9296 14.4059 13.2456 14.7197L16.5386 12.9237C16.4257 12.3938 16.5072 11.841 16.7684 11.3663C17.0296 10.8916 17.4529 10.5268 17.9609 10.3385C18.4689 10.1503 19.0278 10.1512 19.5352 10.3412C20.0426 10.5311 20.4646 10.8973 20.7242 11.3728C20.9838 11.8484 21.0636 12.4015 20.9489 12.931C20.8342 13.4605 20.5327 13.931 20.0996 14.2565C19.6665 14.582 19.1307 14.7407 18.5902 14.7037C18.0497 14.6666 17.5406 14.4362 17.156 14.0546L13.863 15.8506C13.9287 16.1603 13.9287 16.4804 13.863 16.7902L17.156 18.5861C17.5406 18.2046 18.0497 17.9742 18.5902 17.9371C19.1307 17.9 19.6665 18.0588 20.0996 18.3843C20.5327 18.7098 20.8342 19.1803 20.9489 19.7098C21.0636 20.2393 20.9838 20.7924 20.7242 21.2679C20.4646 21.7435 20.0426 22.1097 19.5352 22.2996C19.0278 22.4895 18.4689 22.4905 17.9609 22.3022C17.4529 22.114 17.0296 21.7492 16.7684 21.2745C16.5072 20.7998 16.4257 20.247 16.5386 19.7171Z" />
    </svg>
  )
}

export const BacklinkIcon = {
  height: 24,
  width: 24,
  body: `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4 20.86a2 2 0 0 1-1.388-.56 1 1 0 0 1 1.128-.474c.082.022.169.034.26.034h1a1 1 0 0 1 1 1H4zm8 0a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1h4zm5.388-.56a1 1 0 0 0-1.128-.474 1.005 1.005 0 0 1-.26.034h-1a1 1 0 0 0-1 1h2a2 2 0 0 0 1.388-.56zM18 16.86a1 1 0 0 0-1 1v1a1 1 0 0 1-.034.26 1 1 0 0 0 .474 1.129A2.005 2.005 0 0 0 18 18.86v-2zm0-6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v-4zm-.56-5.388a1 1 0 0 0-.474 1.129 1 1 0 0 1 .034.26v1a1 1 0 0 0 1 1v-2a2 2 0 0 0-.56-1.39zM14 4.86a1 1 0 0 0 1 1h1c.091 0 .178.012.26.034a1 1 0 0 0 1.128-.473A2.004 2.004 0 0 0 16 4.86h-2zm-6 0a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1H8zm-2 0a1 1 0 0 1-1 1H4c-.091 0-.178.012-.26.034a1 1 0 0 1-1.128-.473A2.007 2.007 0 0 1 4 4.86h2zm-4 4a1 1 0 0 0 1-1v-1c0-.09.012-.178.034-.26a1 1 0 0 0-.474-1.128A2.007 2.007 0 0 0 2 6.86v2zm0 6a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1v4zm.56 5.389a1 1 0 0 0 .474-1.13A1.003 1.003 0 0 1 3 18.86v-1a1 1 0 0 0-1-1v2a2.003 2.003 0 0 0 .56 1.389z" fill="currentColor"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.675 1.754a1 1 0 0 1 1 1c0 2.574-.38 4.594-1.58 6.168-1.194 1.568-3.07 2.52-5.632 3.29l-.013.004-5.8 1.57 3.368 2.081a1 1 0 0 1-1.052 1.701l-6.12-3.782 3.224-6.18a1 1 0 1 1 1.773.924l-1.738 3.332 5.796-1.57c2.43-.73 3.8-1.527 4.604-2.582.8-1.05 1.17-2.53 1.17-4.956a1 1 0 0 1 1-1z" fill="currentColor"/>`
}

export const getMIcon = (type: MIcon['type'], value: MIcon['value']) => {
  return {
    type,
    value
  }
}

export const DefaultMIcons = {
  NOTE: getMIcon('ICON', 'gg:file-document'),
  SNIPPET: getMIcon('ICON', 'ri:quill-pen-line'),
  SHARED_NOTE: getMIcon('ICON', 'mex:shared-note'),
  TASK: getMIcon('ICON', 'mex:task-progress'),
  VIEW: getMIcon('ICON', 'ri:stack-line'),
  TEMPLATE: getMIcon('ICON', 'ri:magic-line'),
  PROMPT: getMIcon('ICON', 'material-symbols:charger-outline'),
  HIGHLIGHT: getMIcon('ICON', 'ri:mark-pen-line'),
  MENTION: getMIcon('ICON', 'ri:at-line'),
  WEB_LINK: getMIcon('ICON', 'ri:link'),
  SHARE: getMIcon('ICON', 'ri:share-line'),
  TAG: getMIcon('ICON', 'ri:hashtag'),
  SPACE: getMIcon('ICON', 'heroicons-outline:view-grid'),
  ARCHIVE: getMIcon('ICON', 'ri:archive-line'),
  COPY: getMIcon('ICON', 'ri:file-copy-line'),
  DELETE: getMIcon('ICON', 'ri:delete-bin-5-line'),
  MOVE: getMIcon('ICON', 'ri:anticlockwise-2-fill'),
  SEND: getMIcon('ICON', 'ph:arrow-bend-up-right-bold'),
  EDIT: getMIcon('ICON', 'ri:pencil-fill'),
  ADD: getMIcon('ICON', 'ic:round-plus'),
  CLEAR: getMIcon('ICON', 'ic:round-clear'),
  REMINDER: getMIcon('ICON', 'ri:timer-flash-line'),
  TEXT: getMIcon('ICON', 'ri:paragraph'),
  GROUPBY: getMIcon('ICON', 'fluent:group-list-20-filled'),
  SELECT: getMIcon('ICON', 'bxs:select-multiple'),
  IMAGE: getMIcon('ICON', 'bx:image'),
  AI: getMIcon('ICON', 'carbon:magic-wand-filled'),
  EMBED: getMIcon('ICON', 'lucide:file-input'),
  INSERT: getMIcon('ICON', 'ri:arrow-go-back-line'),
  SEARCH: getMIcon('ICON', 'ri:search-line'),
  WORKSPACE: getMIcon('ICON', 'icon-park-solid:app-switch'),
  PEOPLE: getMIcon('ICON', 'bi:people')
}

export const ForwardlinkIcon = {
  height: 24,
  width: 24,
  body: `
    <g clip-path="url(#a)" fill-rule="evenodd" clip-rule="evenodd" fill="currentColor"><path d="M4 20.86a2 2 0 0 1-1.388-.56 1 1 0 0 1 1.128-.474c.082.022.169.034.26.034h1a1 1 0 0 1 1 1H4zm8 0a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1h4zm5.388-.56a1 1 0 0 0-1.128-.474 1.005 1.005 0 0 1-.26.034h-1a1 1 0 0 0-1 1h2a2 2 0 0 0 1.388-.56zM18 16.86a1 1 0 0 0-1 1v1a1 1 0 0 1-.034.26 1 1 0 0 0 .474 1.129A2.005 2.005 0 0 0 18 18.86v-2zm0-6a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v-4zm-.56-5.388a1 1 0 0 0-.474 1.129 1 1 0 0 1 .034.26v1a1 1 0 0 0 1 1v-2a2 2 0 0 0-.56-1.39zM14 4.86a1 1 0 0 0 1 1h1c.091 0 .178.012.26.034a1 1 0 0 0 1.128-.473A2.004 2.004 0 0 0 16 4.86h-2zm-6 0a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1H8zm-2 0a1 1 0 0 1-1 1H4c-.091 0-.178.012-.26.034a1 1 0 0 1-1.128-.473A2.007 2.007 0 0 1 4 4.86h2zm-4 4a1 1 0 0 0 1-1v-1c0-.09.012-.178.034-.26a1 1 0 0 0-.474-1.128A2.007 2.007 0 0 0 2 6.86v2zm0 6a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1v4zm.56 5.389a1 1 0 0 0 .474-1.13A1.003 1.003 0 0 1 3 18.86v-1a1 1 0 0 0-1-1v2a2.003 2.003 0 0 0 .56 1.389z"/><path d="M8.032 16.421a1 1 0 0 1-1-1c0-2.574.38-4.594 1.58-6.168 1.194-1.568 3.07-2.52 5.633-3.29l.013-.003 5.799-1.571-3.367-2.08A1 1 0 0 1 17.74.606l6.12 3.782-3.224 6.181a1 1 0 0 1-1.773-.925l1.738-3.332-5.795 1.57c-2.43.73-3.8 1.527-4.604 2.582-.8 1.05-1.17 2.53-1.17 4.956a1 1 0 0 1-1 1z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h24v24H0z"/></clipPath></defs>`
}

export const TaskTodoIcon = {
  height: 24,
  width: 24,
  body: `<rect x="0.857143" y="0.857143" width="22.2857" height="22.2857" rx="5.14286" stroke="currentColor" fill="none" stroke-width="1.71429"/>`
}

export const TaskProgressIcon = {
  height: 24,
  width: 24,
  body: `
  <rect x="3.42857" y="12" width="17.1429" height="8.57143" rx="4" fill="currentColor"/>
  <rect x="0.857143" y="0.857143" width="22.2857" height="22.2857" rx="5.14286" stroke="currentColor" fill="none" stroke-width="1.71429"/>`
}

export const TaskCompleteIcon = {
  height: 24,
  width: 24,
  body: `
    <rect x="3.42857" y="3.42859" width="17.1429" height="17.1429" rx="4" fill="currentColor"/>
    <rect x="0.857143" y="0.857143" width="22.2857" height="22.2857" rx="5.14286" stroke="currentColor" fill="none" stroke-width="1.71429"/>`
}

export const addIconsToIconify = () => {
  addIcon('mex:shared-note', SharedNodeIconify)
  addIcon('mex:backlink', BacklinkIcon)
  addIcon('mex:forwardlink', ForwardlinkIcon)
  addIcon('mex:task-todo', TaskTodoIcon)
  addIcon('mex:task-progress', TaskProgressIcon)
  addIcon('mex:task-complete', TaskCompleteIcon)
}
