import { animated } from 'react-spring'

import styled, { css } from 'styled-components'

import { BodyFont } from '../../Style/Search'

export const DrawerContainer = styled(animated.div)`
  position: absolute;
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  right: 10px;
  height: 400px;
  width: 400px;
  border-radius: ${({ theme }) => `${theme.borderRadius.large} ${theme.borderRadius.large} 0 0`};
  ${({ theme }) => css`
    box-shadow: 0px -10px 40px ${theme.tokens.colors.black};
  `}

  padding: ${({ theme }) => theme.spacing.medium};
  box-sizing: border-box;

  * {
    margin: 0;
  }
`

export const DrawerHeaderDesc = styled.div`
  ${BodyFont}
  color: ${({ theme }) => theme.tokens.text.fade};
  opacity: 0.9;
`

export const DrawerHeaderContainer = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.medium};
`
