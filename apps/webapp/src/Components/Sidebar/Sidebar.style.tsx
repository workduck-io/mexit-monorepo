import { clamp } from 'lodash'
import { transparentize } from 'polished'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

import { Button, Ellipsis, LoadingButton } from '@workduck-io/mex-components'

import { IconWrapper, Input, TagsFlex, SidebarListWrapper } from '@mexit/shared'

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.small};

  ${SidebarListWrapper} {
    height: 90%;
  }
`

export const SpaceWrapper = styled(SidebarWrapper)`
  gap: ${({ theme }) => theme.spacing.small};
`

export const SpaceContentWrapper = styled.div`
  height: calc(100% - 4rem);
  overflow: hidden;
`

export const SingleSpace = styled(animated.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100% - 8rem);
  gap: ${({ theme }) => theme.spacing.medium};
  width: 95%;
`

export const SpaceHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  gap: ${({ theme }) => theme.spacing.medium};

  ${TagsFlex} {
    min-width: 266px;
  }
`

export const SpaceTitleWrapper = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-left: ${({ theme }) => theme.spacing.small};

  ${Input} {
    max-width: 159px;
    flex-shrink: 1;
  }
`

export const SpaceTitleFakeInput = styled.div`
  display: inline-block;

  color: ${({ theme }) => theme.colors.form.input.fg};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};
  border: none;
  width: 100%;
  max-width: 159px;
  flex-shrink: 1;
  ${Ellipsis};

  :hover {
    background-color: ${({ theme }) => theme.colors.form.input.bg};
  }
`

export const SpaceTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const VisibleFade = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;

  ${({ visible }) =>
    visible
      ? css`
          opacity: 1;
          pointer-events: all;
        `
      : css`
          opacity: 0;
          pointer-events: none;
        `}
`

export const SidebarToggle = styled.div<{ isVisible?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 50%;

  :hover {
    color: ${({ theme }) => theme.colors.text.heading};
    background-color: ${({ theme }) => theme.colors.gray[8]};
  }

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};

  svg {
    height: 16px;
    width: 16px;
  }
`

export const PinnedList = styled.div`
  display: flex;
  flex-direction: column;
`

export const MexTreeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 0%;
  gap: ${({ theme }) => theme.spacing.small};
`

export const SpaceList = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

export const SpaceSeparator = styled.div`
  height: 1px;
  width: 100%;
  margin: auto;

  background: ${({ theme }) => theme.colors.gray[8]};
`
export const SpaceSwitcher = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
`

export const SwitcherSpaceItems = styled.div`
  display: -webkit-box;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  flex-grow: 1;
  overflow-y: hidden;
  overflow-x: auto;
  padding: 0 ${({ theme }) => theme.spacing.medium};
  ::-webkit-scrollbar {
    display: none;
  }
`

export const SpaceItem = styled.div<{ active: boolean; totalItems: number; sidebarWidth: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  flex-shrink: 0;
  transition: 0.2s color ease-out, 0.2s font-size ease-out, 0.2s background-color ease-out, 0.2s height ease-out,
    0.2s width ease-out, border 0.2s ease-out;

  ${IconWrapper} {
    transition: 0.2s color ease-out, 0.2s font-size ease-out, 0.2s background-color ease-out, 0.2s height ease-out,
      0.2s width ease-out;
  }
  // To set icon size
  max-height: 34px;
  max-width: 34px;

  ${({ theme, sidebarWidth, totalItems, active }) => {
    // Calculate apparent size of icons
    const calcSize = active ? 28 : (sidebarWidth - 150) / totalItems
    // Limit it
    const size = clamp(calcSize, 8, 28)

    // We show size greater than 16px as icons
    if (calcSize > 20) {
      return css`
        background-color: ${active ? theme.colors.gray[8] : 'transparent'};
        color: ${active ? theme.colors.primary : theme.colors.text.fade};

        ${IconWrapper} {
          height: ${size}px;
          width: ${size}px;
          font-size: ${size}px;
        }
        :hover {
          background-color: ${theme.colors.gray[8]};
        }
      `
    }

    // Otherwise hide svg and show a dot
    return css`
      background-color: ${theme.colors.gray[7]};
      border: 3px solid ${theme.colors.background.sidebar};
      ${IconWrapper} {
        height: 0%;
        width: 0%;
        font-size: 0px;
      }
      height: 8px;
      width: 8px;
      :hover {
        background-color: ${theme.colors.gray[8]};
        height: ${28}px;
        width: ${28}px;
        border: 3px solid ${theme.colors.gray[8]};

        ${IconWrapper} {
          height: ${24}px;
          width: ${24}px;
          font-size: ${24}px;
        }
      }
    `
  }}

  :hover {
    background-color: ${({ theme }) => theme.colors.gray[8]};
  }

  svg {
    height: 100%;
    width: 100%;
  }
`

interface CreateNewButtonProps {
  menuOpen?: boolean
}

export const CreateNewButton = styled.button<CreateNewButtonProps>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.default};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  transition: 0.15s transform ease-out, 0.5s color ease-in;

  :hover {
    transform: translateX(-10%) scale(1.25);
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ menuOpen }) =>
    menuOpen &&
    css`
      transform: translateX(-10%) scale(1.25);
      color: ${({ theme }) => theme.colors.primary};
    `}

  svg {
    height: 20px;
    width: 20px;
  }
`

export const CreateNewMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  flex-direction: column;
  min-width: 200px;
  border-radius: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.colors.gray[8]};
`

export const CreateNewMenuItemWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.spacing.tiny};
  gap: ${({ theme }) => theme.spacing.tiny};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
`

const SpecialNoteStyle = css`
  background: ${({ theme }) => transparentize(0.75, theme.colors.gray[9])};
  border: 1px dashed ${({ theme }) => theme.colors.gray[8]};
  padding: 0.5rem;
  justify-content: flex-start;
  box-shadow: none;
  color: ${({ theme }) => theme.colors.text.fade};
  width: 100%;
  span {
    ${Ellipsis}
  }

  .noteTitle {
    color: ${({ theme }) => transparentize(0.25, theme.colors.primary)};
  }

  &:hover,
  &:focus,
  &:active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => transparentize(0.75, theme.colors.gray[9])};
    border: 1px dashed ${({ theme }) => theme.colors.primary};
    .noteTitle {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  &:disabled {
    background: transparent;
  }

  svg {
    flex-shrink: 0;
    height: 16px;
    width: 16px;
  }
`

export const SStarNoteButton = styled(LoadingButton)`
  ${SpecialNoteStyle}
  ${({ highlight }) =>
    highlight &&
    css`
      transition: 0s;
      opacity: 0;
      pointer-events: none;
    `}
`

export const CreateNewNoteSidebarButton = styled(Button)`
  ${SpecialNoteStyle}
`
