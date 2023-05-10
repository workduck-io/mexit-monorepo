import { animated } from 'react-spring'

import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { fadeIn } from '@mexit/shared'

export const VerticalCenter = styled.div<{ fade?: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};
  height: calc(100vh - 90px);
  flex-direction: column;
  position: absolute;
  width: 100%;

  animation: ${({ fade }) =>
    fade
      ? css`
          ${fadeIn} 0.25s ease-in-out
        `
      : ''};
`

export const FlexEndButton = styled.div`
  justify-self: flex-end;
  margin-top: auto;
`

export const StyledSpaceSwitcher = styled.div`
  position: relative;
  width: 100%;
`

export const StyledHover = css`
  :hover {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: ${({ theme }) => theme.borderRadius.small};
    transition: background-color 0.2s ease-in-out;
    ${({ theme }) => generateStyle(theme.sidebar.nav.link.main)}
    width: fit-content;
    height: fit-content;
  }
`

export const ActiveWorkspaceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.medium} 0 0`};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`

export const IconContainer = styled.div`
  box-sizing: border-box;
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};

  ${StyledHover}
`

export const WorkspaceIconContainer = styled(animated.div)<{ active?: boolean }>`
  box-sizing: border-box;
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};

  ${StyledHover}
  border-radius: ${({ theme }) => theme.borderRadius.small};
  ${({ active, theme }) =>
    active &&
    css`
      opacity: 0.7;
      border: 1px solid ${theme.tokens.surfaces.separator};
      background-color: ${theme.tokens.surfaces.sidebar};
    `}
`
