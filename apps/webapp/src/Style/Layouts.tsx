import styled, { css } from 'styled-components'
import { Icon } from '@iconify/react'

export const Wrapper = styled.div`
  margin: 0 ${({ theme }) => theme.spacing.large};
`

export const MexIcon = styled(Icon)`
  padding: 1px;
  :hover {
    background-color: ${(props) => props.theme.colors.background.card};
    border-radius: 5px;
  }
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
