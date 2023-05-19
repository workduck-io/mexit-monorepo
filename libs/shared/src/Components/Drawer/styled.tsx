import { animated } from 'react-spring'

import styled, { css } from 'styled-components'

import { BodyFont } from '../../Style/Search'

export enum DRAWER_HEIGHT_STATES {
  NORMAL = '28em',
  LOADING = '5em'
}

export const DrawerContainer = styled(animated.div)`
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  position: fixed;
  z-index: 100000;
  right: 10px;
  width: 380px;

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

export const DrawerHeaderDesc = styled.div<{ fade?: boolean }>`
  ${BodyFont}
  color: ${({ theme }) => theme.tokens.text.fade};

  opacity: ${({ fade }) => (fade ? 0.6 : 0.9)};
`

export const DrawerHeaderContainer = styled.div<{ align?: 'start' | 'center' }>`
  ${({ align }) =>
    align === 'center'
      ? css`
          align-items: center;
        `
      : css`
          align-items: flex-start;
        `}
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.medium};
`
