import { FOCUS_MODE_OPACITY } from '@mexit/core'

import { Button } from './Buttons'
import { FocusModeProp } from './Editor'
import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

export const Float = styled.div<FocusModeProp>`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1000;
  ${({ $focusMode }) =>
    $focusMode &&
    css`
      opacity: ${FOCUS_MODE_OPACITY};
      &:hover {
        opacity: 1;
      }
    `}
`

export const FlexBetween = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

export const FloatButton = styled(Button)`
  border-radius: 50%;
  height: 3.2rem;
  cursor: pointer;
  width: 3.2rem;
  padding: 0.8rem;
  :hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const FloatingMenu = styled.div`
  height: fit-content;
  max-height: 400px;
  width: 250px;

  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.card};
`

export const StyledMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  text-align: left;
  color: ${({ theme }) => theme.colors.text.default};
  margin-bottom: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.card};
  :hover {
    cursor: pointer;
    border-radius: 0.5rem;
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }
`

export const ClickableIcon = styled(Icon)`
  cursor: pointer;
  border-radius: 50%;
  :hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
