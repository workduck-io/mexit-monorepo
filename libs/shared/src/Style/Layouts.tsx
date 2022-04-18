import styled, { css } from 'styled-components'
import { Icon } from '@iconify/react'
import { Title } from './Typography'

export const Wrapper = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.large};
  margin-right: 3rem;
`

export const PageContainer = styled.div`
  margin: ${({ theme: { spacing } }) => `calc(2 * ${spacing.large}) ${spacing.large} ${spacing.medium}`};
  position: relative;
`

export const MexIcon = styled(Icon)<{ margin?: string; noHover?: boolean }>`
  padding: 1px;
  margin: ${({ margin }) => margin};
  ${({ noHover }) =>
    !noHover &&
    css`
      :hover {
        background-color: ${(props) => props.theme.colors.background.card};
        border-radius: 5px;
      }
    `}
`

export const centeredCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Centered = styled.div`
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

export default Centered

export const MainHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};

  ${Title} {
    font-size: 2rem;
    font-weight: bold;
    flex-grow: 1;
  }
`
