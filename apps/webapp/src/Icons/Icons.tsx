import React from 'react'
// Icons for sidebar and UI
import bxChevronDownCircle from '@iconify/icons-bx/bx-chevron-down-circle'
import checkboxBlankCircleFill from '@iconify/icons-ri/checkbox-blank-circle-fill'
import checkboxBlankCircleLine from '@iconify/icons-ri/checkbox-blank-circle-line'
import draftFill from '@iconify/icons-ri/draft-fill'
import draftLine from '@iconify/icons-ri/draft-line'
// Icons for Editor
import externalLinkLine from '@iconify/icons-ri/external-link-line'
import starFill from '@iconify/icons-ri/star-fill'
import starLine from '@iconify/icons-ri/star-line'
import taskFill from '@iconify/icons-ri/task-fill'
import taskLine from '@iconify/icons-ri/task-line'
import Github from './github'
import Asana from './Asana'
import Linear from './linear'
import Telegram from './Telgram'
import Slack from './slack'
import { ReactComponent as Jira } from './Jira.svg'
import { ReactComponent as Figma } from './Figma.svg'
import { ReactComponent as Google } from './Google.svg'
import Whatsapp from './whatsapp'

// `any` is used in type signature as `IconifyIcon` type doesn't work

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const MexIcons: { [key: string]: [any, any] } = {
  // First element of array is of closed Icon and the second is for open
  openClose: [checkboxBlankCircleFill, bxChevronDownCircle],
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
  externalLink: externalLinkLine
}

export default MexIcons

type SharedNodeIconProps = {
  fill?: string
  height?: number
  width?: number
  margin?: string
}

export const SharedNodeIcon: React.FC<SharedNodeIconProps> = ({
  fill = 'none',
  margin = '0',
  height = 24,
  width = 24
}) => {
  return (
    <svg
      width={`${width}`}
      style={{ margin }}
      height={`${height}`}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 22C3.73478 22 3.48043 21.8946 3.29289 21.7071C3.10536 21.5196 3 21.2652 3 21V3C3 2.73478 3.10536 2.48043 3.29289 2.29289C3.48043 2.10536 3.73478 2 4 2H20C20.2652 2 20.5196 2.10536 20.7071 2.29289C20.8946 2.48043 21 2.73478 21 3V9L19 7.5V4H5V20H11.5L15 22H4Z" />
      <path d="M8 7V9H14L15.5 7H8Z" />
      <path d="M7.9947 10.9931L8 13H9.5L11.5 11L7.9947 10.9931Z" />
      <path d="M16.5386 19.7171L13.2456 17.9211C12.9296 18.2349 12.5276 18.448 12.0906 18.5337C11.6535 18.6194 11.2009 18.5738 10.7897 18.4026C10.3786 18.2314 10.0273 17.9423 9.7802 17.5717C9.53311 17.2012 9.40125 16.7658 9.40125 16.3204C9.40125 15.875 9.53311 15.4396 9.7802 15.069C10.0273 14.6985 10.3786 14.4094 10.7897 14.2382C11.2009 14.067 11.6535 14.0214 12.0906 14.1071C12.5276 14.1927 12.9296 14.4059 13.2456 14.7197L16.5386 12.9237C16.4257 12.3938 16.5072 11.841 16.7684 11.3663C17.0296 10.8916 17.4529 10.5268 17.9609 10.3385C18.4689 10.1503 19.0278 10.1512 19.5352 10.3412C20.0426 10.5311 20.4646 10.8973 20.7242 11.3728C20.9838 11.8484 21.0636 12.4015 20.9489 12.931C20.8342 13.4605 20.5327 13.931 20.0996 14.2565C19.6665 14.582 19.1307 14.7407 18.5902 14.7037C18.0497 14.6666 17.5406 14.4362 17.156 14.0546L13.863 15.8506C13.9287 16.1603 13.9287 16.4804 13.863 16.7902L17.156 18.5861C17.5406 18.2046 18.0497 17.9742 18.5902 17.9371C19.1307 17.9 19.6665 18.0588 20.0996 18.3843C20.5327 18.7098 20.8342 19.1803 20.9489 19.7098C21.0636 20.2393 20.9838 20.7924 20.7242 21.2679C20.4646 21.7435 20.0426 22.1097 19.5352 22.2996C19.0278 22.4895 18.4689 22.4905 17.9609 22.3022C17.4529 22.114 17.0296 21.7492 16.7684 21.2745C16.5072 20.7998 16.4257 20.247 16.5386 19.7171Z" />
    </svg>
  )
}

export const ServiceIcon = ({ serviceName, height, width }) => {
  height = height ?? 128
  width = width ?? 128

  switch (serviceName) {
    case 'ASANA':
      return <Asana height={height} width={width} />
    case 'FIGMA':
      return <Figma height={height} width={width} />
    case 'GITHUB':
      return <Github height={height} width={width} />
    case 'GOOGLE':
      return <Google height={height} width={width} />
    case 'JIRA':
      return <Jira height={height * 4} width={width * 4} />
    case 'LINEAR':
      return <Linear height={height} width={width} />
    case 'TELEGRAM':
      return <Telegram height={height} width={width} />
    case 'WHATSAPP':
      return <Whatsapp height={height} width={width} />
    case 'SLACK':
      return <Slack height={height} width={width} />
  }
}
