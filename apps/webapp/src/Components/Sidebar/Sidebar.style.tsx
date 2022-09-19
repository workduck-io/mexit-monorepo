import { transparentize } from 'polished'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

import { Ellipsis, LoadingButton } from '@workduck-io/mex-components'

import { TagsFlex } from '@mexit/shared'

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.small};
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

  gap: ${({ theme }) => theme.spacing.medium};

  ${TagsFlex} {
    min-width: 276px;
  }
`

export const SpaceTitleWrapper = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-left: ${({ theme }) => theme.spacing.small};
`

export const SpaceTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
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
`

export const SwitcherSpaceItems = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`

export const SpaceItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: 0.15s transform ease-out, 0.2s color ease-in;

  color: ${({ theme }) => theme.colors.gray[6]};
  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.colors.text.heading};
    `}

  :hover {
    transform: scale(1.25);
    background-color: ${({ theme }) => theme.colors.gray[8]};
  }

  svg {
    height: 20px;
    width: 20px;
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

export const SStarNoteButton = styled(LoadingButton)`
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

  ${({ highlight }) =>
    highlight &&
    css`
      transition: 0s;
      opacity: 0;
      pointer-events: none;
    `}

  svg {
    flex-shrink: 0;
    height: 16px;
    width: 16px;
  }
`
