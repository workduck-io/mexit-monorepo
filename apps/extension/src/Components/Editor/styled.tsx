import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

import { Scroll } from '@mexit/shared'

export const EditorWrapper = styled(animated.div)`
  display: flex;
  flex: 1;
  max-height: 100%;
  overflow: scroll;

  background-color: ${({ theme }) => theme.colors.background.modal};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
  ${Scroll}
`

export const SeePreview = styled.div`
  position: fixed;
  right: 1.2rem;
  cursor: pointer;
  z-index: 3000;
  display: flex;
  padding: 5px;
  border-radius: 50%;
  border: none;
  color: ${({ theme }) => theme.colors.text.fade};
  box-shadow: 0px 2px 4px ${({ theme }) => theme.colors.background.modal};
  background-color: ${({ theme }) => theme.colors.background.app};
  bottom: 1.8rem;
`
