import React, { useRef, useState } from 'react'

import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import styled, { css, useTheme } from 'styled-components'

import { Group, IconDisplay, MexIcon } from '@mexit/shared'

import { useViewFilterStore } from '../../../../Hooks/todo/useTodoFilters'
import useGroupHelper from '../../../../Hooks/useGroupHelper'

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

export const GroupHeader = styled.div<{ isOpen?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  user-select: none;
  cursor: pointer;

  ${MexIcon} {
    transition: all 0.2s linear;

    ${({ isOpen }) =>
      isOpen
        ? css`
            transform: rotateZ(-90deg);
          `
        : css`
            transform: rotateZ(0deg);
          `}
  }
`

const AccordionContent = styled.div<{ isOpen?: boolean; height?: any }>`
  overflow: hidden;

  ${({ isOpen }) =>
    isOpen
      ? css`
          max-height: 40rem;
          overflow-y: auto;
          opacity: 1;
          padding: 10px;
        `
      : css`
          max-height: 0;
          opacity: 0;
          padding: 0 10px;
        `}
  transition-property: max-height, opacity, padding;
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
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
  const ref = useRef(null)
  const theme = useTheme()
  const { getResultGroup } = useGroupHelper()
  const [isOpen, setIsOpen] = useState(defaultOpenState)

  const groupBy = useViewFilterStore((store) => store.groupBy)

  const handleToggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const group = getResultGroup(label, groupBy)

  if (!group) return

  return (
    <StyledResultGroup>
      <GroupHeader isOpen={!!isOpen} onClick={handleToggleAccordion}>
        <Group>
          <IconDisplay size={14} icon={group.icon} color={theme.tokens.colors.primary.default} />
          <span>{group.label}</span>
          <Count>{count}</Count>
        </Group>
        <MexIcon
          $noHover
          onClick={handleToggleAccordion}
          cursor="pointer"
          height={24}
          width={24}
          icon={arrowLeftSLine}
        />
      </GroupHeader>

      <AccordionContent isOpen={isOpen} height={ref?.current?.scrollHeight} ref={ref}>
        {children}
      </AccordionContent>
    </StyledResultGroup>
  )
}

export default ResultGroup

// * From a given list create a group based on key
