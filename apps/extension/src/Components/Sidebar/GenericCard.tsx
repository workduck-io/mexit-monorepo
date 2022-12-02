import React from 'react'

import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { SnippetCardHeader, SnippetCardWrapper } from '@mexit/shared'

const GenericContent = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
`

export const GenericCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  return (
    <SnippetCardWrapper>
      <SnippetCardHeader>
        <Icon icon={icon} />
        {title}
      </SnippetCardHeader>
      <GenericContent>{description}</GenericContent>
    </SnippetCardWrapper>
  )
}
