import React, { useState } from 'react'

import arrowDownSLine from '@iconify/icons-ri/arrow-down-s-line'
import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import styled, { useTheme } from 'styled-components'

import { Group, IconDisplay, MexIcon, SearchEntities } from '@mexit/shared'

const StyledResultGroup = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[3]}, 0.4)`};
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.small};
`

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  user-select: none;
  cursor: pointer;
`

const AccordionContent = styled.div<{ isOpen?: boolean }>`
  padding: 10px;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`

const Count = styled.span`
  color: ${({ theme }) => theme.tokens.text.fade};
  opacity: 0.5;
`

const ResultGroup: React.FC<{ label: string; children: any; count: number }> = ({ label, children, count }) => {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const group = SearchEntities[label]

  return (
    <StyledResultGroup>
      <GroupHeader onClick={handleToggleAccordion}>
        <Group>
          <IconDisplay icon={group.icon} color={theme.tokens.colors.primary.default} />
          <span>{group.label}</span>
          <Count>{count}</Count>
        </Group>
        <MexIcon onClick={handleToggleAccordion} icon={!isOpen ? arrowLeftSLine : arrowDownSLine} />
      </GroupHeader>

      <AccordionContent isOpen={isOpen}>{children}</AccordionContent>
    </StyledResultGroup>
  )
}

export default ResultGroup

// * From a given list create a group based on key
