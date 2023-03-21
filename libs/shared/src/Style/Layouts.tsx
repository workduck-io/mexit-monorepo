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

export const Group = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const MexIcon = styled(Icon)<{ margin?: string; $noHover?: boolean; $cursor?: boolean }>`
  padding: 1px;
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

export const CenterSpace = styled(CenteredColumn)`
  padding: 1rem 0;
`

export const SpaceBetweenHorizontalFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
