import { animated } from 'react-spring'

import { clamp } from 'lodash'
import styled, { css } from 'styled-components'

import { Button, Ellipsis, LoadingButton } from '@workduck-io/mex-components'
import { generateStyle } from '@workduck-io/mex-themes'

import { IconWrapper, Input, SidebarListWrapper, TagsFlex } from '@mexit/shared'

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

  color: ${({ theme }) => theme.generic.form.input.textColor};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  padding: ${({ theme: { spacing } }) => `${spacing.small} 8px`};
  border: none;
  width: 100%;
  max-width: 159px;
  flex-shrink: 1;
  ${Ellipsis};

  :hover {
    background-color: ${({ theme }) => theme.generic.form.input.surface};
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
  color: ${({ theme }) => theme.tokens.text.fade};
  border-radius: 50%;

  :hover {
    color: ${({ theme }) => theme.sidebar.toggle.iconColor};
    background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
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

  background: ${({ theme }) => theme.tokens.surfaces.separator};
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
    // background-color: ${active ? theme.colors.gray[8] : 'transparent'};
    // color: ${active ? theme.colors.primary : theme.tokens.text.fade};
    // :hover {
    //   background-color: ${theme.colors.gray[8]};
    // }

    if (calcSize > 20) {
      return css`
        ${({ theme }) =>
          active
            ? generateStyle(theme.sidebar.spaces.item.wrapper.selected)
            : generateStyle(theme.sidebar.spaces.item.wrapper)}

        ${IconWrapper} {
          height: ${size}px;
          width: ${size}px;
          font-size: ${size}px;
          ${({ theme }) =>
            generateStyle(active ? theme.sidebar.spaces.item.icon.selected : theme.sidebar.spaces.item.icon)}
        }
      `
    }

    // Otherwise hide svg and show a dot
    // :hover {
    //   background-color: ${theme.colors.gray[8]};
    //   height: ${28}px;
    //   width: ${28}px;
    //   border: 3px solid ${theme.colors.gray[8]};

    //   ${IconWrapper} {
    //     height: ${24}px;
    //     width: ${24}px;
    //     font-size: ${24}px;
    //   }
    // }
    return css`
      ${({ theme }) => generateStyle(theme.sidebar.spaces.item.wrapper)}
      border: 3px solid ${({ theme }) => theme.sidebar.wrapper.surface};
      ${IconWrapper} {
        ${({ theme }) => generateStyle(theme.sidebar.spaces.item.icon)}
        height: 0%;
        width: 0%;
        font-size: 0px;
      }
      height: 8px;
      width: 8px;
      :hover {
        height: ${28}px;
        width: ${28}px;

        ${IconWrapper} {
          height: ${24}px;
          width: ${24}px;
          font-size: ${24}px;
        }
      }
    `
  }}

  :hover {
    background-color: ${({ theme }) => theme.sidebar.spaces.item.wrapper.selected.surface};
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
  ${({ theme }) => generateStyle(theme.sidebar.createNew)}
  transition: 0.15s transform ease-out, 0.5s color ease-in;

  :hover {
    transform: translateX(-10%) scale(1.25);
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }

  ${({ menuOpen }) =>
    menuOpen &&
    css`
      transform: translateX(-10%) scale(1.25);
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    `}

  svg {
    height: 20px;
    width: 20px;
  }
`

export const CreateNewMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  ${({ theme }) => generateStyle(theme.generic.contextMenu.menu)}
  min-width: 200px;
  padding: 5px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
`

export const CreateNewMenuItemWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: ${({ theme }) => theme.spacing.tiny};
  font-size: 14px;
  line-height: 1;
  gap: 5px;
  height: 25px;
  padding: 0px 5px;
  position: relative;
  padding-left: 5px;
  user-select: none;
  svg {
    transition: color 0.2s ease-in-out;
  }
  ${({ theme }) => generateStyle(theme.generic.contextMenu.item)}
  &:hover, &:active {
    svg {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
`

const SpecialNoteStyle = css`
  background: ${({ theme }) => theme.sidebar.tree.item.wrapper.surface};
  border: 1px dashed ${({ theme }) => theme.tokens.surfaces.s[3]};
  padding: 0.5rem;
  justify-content: flex-start;
  box-shadow: none;
  color: ${({ theme }) => theme.tokens.text.fade};
  width: 100%;
  span {
    ${Ellipsis}
  }

  .noteTitle {
    color: rgba(${({ theme }) => theme.rgbTokens.colors.primary.default});
  }

  &:hover,
  &:focus,
  &:active {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    background: rgba(${({ theme }) => theme.tokens.surfaces.modal}, 0.5);
    border: 1px dashed ${({ theme }) => theme.tokens.colors.primary.default};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};

    .noteTitle {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
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
