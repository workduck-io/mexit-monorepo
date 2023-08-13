import React, { useEffect, useRef, useState } from 'react'

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

export const Chevron = styled(MexIcon)<{ isOpen?: boolean }>`
  transition: all 0.2s linear;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  min-width: 16px;
  min-height: auto;
  ${({ isOpen }) =>
    isOpen
      ? css`
          transform: rotateZ(-90deg);
        `
      : css`
          transform: rotateZ(0deg);
        `}
`

export const GroupHeader = styled.div<{ isOpen?: boolean; padding?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  ${({ padding }) =>
    padding &&
    css`
      padding: 10px;
    `}

  user-select: none;
  cursor: pointer;
`

export const AccordionContent = styled.div<{ isOpen?: boolean; height?: any }>`
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
  const [group, setGroup] = useState(null)

  const groupBy = useViewFilterStore((store) => store.groupBy)

  useEffect(() => {
    getResultGroup(label, groupBy).then((res) => {
      setGroup(res)
    })
  }, [groupBy])

  const handleToggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <StyledResultGroup>
      <GroupHeader padding isOpen={!!isOpen} onClick={handleToggleAccordion}>
        {group && (
          <Group>
            <IconDisplay size={14} icon={group.icon} color={theme.tokens.colors.primary.default} />
            <span>{group.label}</span>
            <Count>{count}</Count>
          </Group>
        )}
        <Chevron
          isOpen={isOpen}
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
