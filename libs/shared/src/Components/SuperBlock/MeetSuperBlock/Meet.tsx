import React from 'react'

import { getFavicon } from '@mexit/core'

import { StyledButton } from '../../../Style/Buttons'
import { Group } from '../../../Style/Layouts'
import { ProjectIconMex } from '../../ProjectIcon'
import { RelativeTime } from '../../RelativeTime'

import { StyledMeetContainer } from './styled'

export const Meet = ({ url = 'https://meet.google.com/fsf-vjkg-kuo' }) => {
  const icon = getFavicon(url, 128)

  const handleOpenLink = () => {
    window.open('https://meet.google.com/iyf-kirm-mih', '_blank')
  }

  return (
    <StyledMeetContainer contentEditable={false}>
      <Group gap="medium">
        <ProjectIconMex isMex={false} icon={icon} />
        <a href={'https://meet.google.com/iyf-kirm-mih'} target="_blank" placeholder="Meet Link" rel="noreferrer">
          Google Meet <RelativeTime dateNum={Date.now() + 388120000} />
        </a>
      </Group>
      <StyledButton onClick={handleOpenLink}>Open</StyledButton>
    </StyledMeetContainer>
  )
}

export const MeetActions = ({ content }) => {
  const onClick = () => {
    console.log('summarize')
  }
  return <StyledButton onClick={onClick}>Summarize</StyledButton>
}
