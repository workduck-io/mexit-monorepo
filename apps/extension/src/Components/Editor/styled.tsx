import styled from 'styled-components'
import { Scroll } from '../Results/styled'
import { animated } from 'react-spring'

export const EditorWrapper = styled(animated.div)`
  flex: 1;
  max-height: 100%;
  overflow: scroll;

  background-color: ${({ theme }) => theme.colors.background.modal};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
  ${Scroll}
`
