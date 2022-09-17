import React from 'react'

import { IconifyIcon } from '@iconify/react'

import { SILink, StyledIcon } from '@mexit/shared'

type NoteLinkType = { selected: boolean; icon?: IconifyIcon | string; onClick?: any; text: string; color?: string }

const NoteLink = ({ selected, icon, text, color, onClick }: NoteLinkType) => {
  return (
    <SILink $selected={selected} color={color} onClick={onClick}>
      <StyledIcon icon={icon} color={color} />
      <span className="ILink_decoration ILink_decoration_left">[[</span>
      <span className="ILink_decoration ILink_decoration_value"> {text}</span>
      <span className="ILink_decoration ILink_decoration_right">]]</span>
    </SILink>
  )
}

export default NoteLink
