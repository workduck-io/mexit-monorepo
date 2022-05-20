import styled, { css } from 'styled-components'
import { Scroll } from '../Results/styled'
import { animated } from 'react-spring'
import { EditorStyles } from '@mexit/shared'

export const EditorWrapper = styled(animated.div)`
  display: flex;
  flex: 1;
  max-height: 100%;
  overflow: scroll;

  background-color: ${({ theme }) => theme.colors.background.modal};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
  ${Scroll}
  ${EditorStyles}
`
