import { animated } from 'react-spring'

import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

import { BodyFont, Group, RHSideNav } from '@mexit/shared'

export const ExtSideNav = styled(RHSideNav)`
  position: fixed;
  bottom: 0;
  right: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.tokens.surfaces.s[0]} 0%,
    ${({ theme }) => theme.tokens.surfaces.s[2]} 100%
  );
`

export const SubHeading = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.tokens.text.heading};
`

export const StyledSidebarSection = styled.section<{ scrollable?: boolean }>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  gap: ${({ theme }) => theme.spacing.small};

  ${({ scrollable }) =>
    scrollable &&
    css`
      overflow: auto;
    `}
`

export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: ${({ theme }) => theme.spacing.small} 0;

  ${Group} {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.4;
    line-height: 1.5rem;
    color: ${({ theme }) => theme.tokens.text.fade};
  }
`

export const ExtensionHeaderStyled = styled.section`
  display: flex;
  width: 100%;
  align-items: center;
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.medium};
`

export const SidebarContainer = styled.div`
  position: fixed;
  z-index: 9999999999;

  font-size: 1em;
  color: ${({ theme }) => theme.tokens.text.heading};
`

export const DomainWithHighlight = styled.div`
  margin: ${({ theme }) => theme.spacing.small} 0;
  display: flex;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`

export const EventCard = styled.div`
  ${BodyFont}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em;
  border-radius: 0.5em;
  cursor: pointer;

  :hover {
    background: ${({ theme }) => theme.tokens.surfaces.app};
  }
`

export const EventHeader = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const EventHeading = styled.div`
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.tokens.text.default};
  white-space: nowrap;
  overflow-x: hidden;
`

export const Timestamp = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.tokens.text.fade};
  opacity: 0.7;
`

export const DragIcon = styled(Icon)<{ $show: boolean }>`
  margin-right: -18px;
  opacity: 0;
  pointer-events: none;
  transition: margin-right 0.2s ease-in-out, opacity 0.2s ease-in-out;

  ${(props) =>
    props.$show &&
    css`
      margin-right: 0;
      opacity: 1;
      pointer-events: all;
    `}
`

export const ToggleWrapper = styled(animated.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  width: max-content;
  position: fixed;
  z-index: 9999999999;

  svg {
    height: 16px;
    width: 16px;
  }
`

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;

  padding: 8px;
  margin: 0 0 8px 0;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};
  color: ${({ theme }) => theme.tokens.text.fade};
  transition: right 0.2s ease-in-out, background 0.2s ease-in-out, width 0.2s ease-in-out;

  ${DragIcon} {
    cursor: ns-resize;
  }

  &:hover,
  &:active {
    cursor: pointer;
    transition: background 0.1s ease;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
    background: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.text};

    svg {
      path {
        fill: ${({ theme }) => theme.tokens.surfaces.sidebar};
      }
    }
  }
`

export const ButtonWrapper = styled(animated.div)`
  display: flex;

  position: relative;
  z-index: 0;

  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};
  color: ${({ theme }) => theme.tokens.text.fade};
`
