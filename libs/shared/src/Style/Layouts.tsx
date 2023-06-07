import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

import { fadeIn } from './fade'
import { Title } from './Typography'

export const Wrapper = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.large};
  margin-right: 3rem;
`

export const PageContainer = styled.div<{ fade?: boolean }>`
  margin: ${({ theme: { spacing } }) => `calc(2 * ${spacing.large}) ${spacing.large} ${spacing.medium}`};
  position: relative;

  ${({ fade }) =>
    fade &&
    css`
      animation: ${fadeIn} 0.5s ease-in-out;
    `}
`

export const Group = styled.span<{ gap?: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;

  ${({ theme, gap = 'small' }) => {
    switch (gap) {
      case 'small':
        return `gap: ${theme.spacing.small};`

      case 'medium':
        return `gap: ${theme.spacing.medium};`

      case 'large':
        return `gap: ${theme.spacing.large};`
    }
  }}
`

export const IconButtonWrapper = styled(Group)`
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  border-radius: 0.25em;
  padding: 0.25em 0.5em;

  :hover {
    background: ${({ theme }) => theme.tokens.surfaces.highlight};
  }
`

export const MexIcon = styled(Icon)<{ margin?: string; $noHover?: boolean; $cursor?: boolean }>`
  padding: ${({ theme }) => theme.spacing.tiny};
  margin: ${({ margin }) => margin};

  &.delete {
    color: ${({ theme }) => theme.tokens.text.fade};
    &:hover {
      color: ${({ theme }) => theme.tokens.colors.red};
    }
  }

  ${({ $cursor }) =>
    $cursor &&
    css`
      cursor: pointer;
    `}

  ${({ $noHover }) =>
    !$noHover &&
    css`
      :hover {
        background-color: ${(props) => props.theme.tokens.surfaces.highlight};
        border-radius: 5px;
      }
    `}
`

export const FadeInOut = (isVisible: boolean, duration = '0.5', currentOpacity = '1') => css`
  transition: opacity ${duration + 's'};
  opacity: ${isVisible ? currentOpacity : '0'};
`

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const centeredCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const CenteredColumn = styled(Centered)`
  flex-direction: column;
`

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  margin-top: ${({ theme }) => theme.spacing.small};
  box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  padding: ${({ theme }) => theme.spacing.small};

  img {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    max-height: 64px;
    max-width: 64px;
  }
`

export const CenterSpace = styled(CenteredColumn)`
  padding: 1rem 0;
`

export const SpaceBetweenHorizontalFlex = styled.div<{ width?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ width }) =>
    width &&
    css`
      width: 100%;
      padding: 0.5em;
    `}
`

export const ContentSpacing = css`
  gap: ${({ theme }) => theme.spacing.medium};
  margin: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
`

export const Content = styled.section`
  ${ContentSpacing};
`

export const MainHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${ContentSpacing}

  ${Title} {
    font-size: 2rem;
    font-weight: bold;
    flex-grow: 1;
    margin: 0;
  }
`

export const StyledItemOverlay = styled.div<{ $onHover?: boolean }>`
  position: absolute;
  z-index: 1;
  background: rgba(${({ theme }) => theme.rgbTokens.surfaces.app}, 0.6);
  left: 0;
  top: 0;
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  ${centeredCss}
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.tokens.text.default};
  transition: opacity 0.5s;

  ${({ $onHover }) =>
    $onHover &&
    css`
      opacity: 0;
      :hover {
        border: 1px solid ${({ theme }) => theme.tokens.surfaces.separator};
        opacity: 1;
      }
    `};
`
