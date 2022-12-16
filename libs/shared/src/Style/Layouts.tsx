import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

import { Title } from './Typography'

export const Wrapper = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.large};
  margin-right: 3rem;
`

export const PageContainer = styled.div`
  margin: ${({ theme: { spacing } }) => `calc(2 * ${spacing.large}) ${spacing.large} ${spacing.medium}`};
  position: relative;
`

export const MexIcon = styled(Icon)<{ margin?: string; $noHover?: boolean }>`
  padding: 1px;
  margin: ${({ margin }) => margin};
  &.delete {
    color: ${({ theme }) => theme.tokens.text.fade};
    &:hover {
      color: ${({ theme }) => theme.tokens.colors.red};
    }
  }
  ${({ $noHover }) =>
    !$noHover &&
    css`
      :hover {
        background-color: ${(props) => props.theme.tokens.surfaces.s[3]};
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

export const MainHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.medium};
  margin: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};

  ${Title} {
    font-size: 2rem;
    font-weight: bold;
    flex-grow: 1;
    margin: 0;
  }
`
