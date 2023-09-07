import { animated } from 'react-spring'

import styled, { css } from 'styled-components'

import { BodyFont } from './Search'

export const TabPanel = styled(animated.div)<{ fade?: boolean }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${({ fade }) =>
    fade &&
    css`
      opacity: 0.3;
    `};
`

export const TabHeading = styled.span`
  ${BodyFont}
  color: ${({ theme }) => theme.tokens.text.fade};
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.5rem;
`

export const StyledTab = styled.div.attrs({
  role: 'tab',
  tabIndex: 0
})<{
  selected: boolean
}>`
  display: inline-flex;
  justify-content: center;
  border-top-left-radius: ${({ theme }) => theme.borderRadius.large};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.tiny};
  z-index: 1;
  flex: 1;

  ${({ selected }) =>
    !selected &&
    css`
      :hover {
        background: ${({ theme }) => theme.tokens.surfaces.s[2]};
      }

      opacity: 0.9;
      color: ${({ theme }) => theme.tokens.text.fade};
    `}

  ${({ selected }) =>
    selected &&
    css`
      svg {
        fill: ${({ theme }) => theme.tokens.colors.primary.default};
      }

      color: ${({ theme }) => theme.tokens.colors.primary.default};

      ${TabHeading} {
        color: ${({ theme }) => theme.tokens.text.default};
      }
    `}

  &:focus {
    outline: none;
  }

  cursor: pointer;
`

export const TabBody = styled(animated.div)<{ selected?: boolean }>`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const TabsContainer = styled(animated.section)<{ visible?: boolean }>`
  flex: 1;

  * {
    ${({ visible }) =>
      !visible &&
      css`
        pointer-events: none;
      `}
  }

  width: 100%;
`

export const TabsWrapper = styled.div<{ index: number; total: number }>`
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
  gap: 0 ${({ theme }) => theme.spacing.small};
  border-bottom: 2px solid ${({ theme }) => theme.tokens.surfaces.separator};

  ${({ index, total }) =>
    css`
      &::before {
        content: '';
        display: block;
        position: absolute;
        width: calc(100% / ${total});
        height: 2px;
        border-radius: ${({ theme }) => theme.borderRadius.small};
        left: 0;
        bottom: 0;
        background: ${({ theme }) => theme.tokens.colors.primary.default};
        transform: translateX(${index * 100}%);
        transition: background 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s, transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
      }
    `}
`

export const TabHeaderContainer = styled.div`
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};

  /* padding: ${({ theme }) => theme.spacing.small}; */
  /* border-radius: ${({ theme }) => theme.borderRadius.small}; */
`
