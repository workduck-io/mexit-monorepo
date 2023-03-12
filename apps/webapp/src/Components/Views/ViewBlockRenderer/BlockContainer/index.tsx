import React, { useState } from 'react'

import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import styled, {css, useTheme} from 'styled-components'

import { Group, IconDisplay, MexIcon, SearchEntities } from '@mexit/shared'

const StyledResultGroup = styled.div`

  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[3]}, 0.4)`};
  transition: all 0.2s ease-in;

  :hover {
    background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[4]}, 0.3)`};
  }
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.small};
`

const GroupHeader = styled.div<{ isOpen?: boolean}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  user-select: none;
  cursor: pointer;

  ${MexIcon} {
    transition: all .2s linear;

    ${({ isOpen}) => isOpen ? css`
      transform: rotateZ(-90deg);
    `: css`
      transform: rotateZ(0deg);
    `
  }
`

const AccordionContent = styled.div<{ isOpen?: boolean }>`
  padding: 10px;
  ${(props) => (props.isOpen ? css`
    display: block;
    opacity: 1;
  ` : css`
    display: none;
    opacity: 0;
  `)};
`

const Count = styled.span`
  color: ${({ theme }) => theme.tokens.text.fade};
  opacity: 0.5;
`

const ResultGroup: React.FC<{ label: string; children: any; count: number; isOpen?: boolean }> = ({
  label,
  children,
  count,
  isOpen: defaultOpenState = true
}) => {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(defaultOpenState)

  const handleToggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const group = SearchEntities[label]

  return (
    <StyledResultGroup>
      <GroupHeader isOpen={!!isOpen} onClick={handleToggleAccordion}>
        <Group>
          <IconDisplay icon={group.icon} color={theme.tokens.colors.primary.default} />
          <span>{group.label}</span>
          <Count>{count}</Count>
        </Group>
        <MexIcon $noHover onClick={handleToggleAccordion}  height={24} width={24} icon={arrowLeftSLine} />
      </GroupHeader>

      <AccordionContent isOpen={isOpen}>{children}</AccordionContent>
    </StyledResultGroup>
  )
}

export default ResultGroup

// * From a given list create a group based on key
