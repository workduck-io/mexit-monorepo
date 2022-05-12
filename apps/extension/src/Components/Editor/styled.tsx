import styled, { css } from 'styled-components'
import { Scroll } from '../Results/styled'
import { animated } from 'react-spring'

export const EditorWrapper = styled(animated.div)<{ readOnly?: boolean }>`
  flex: 1;
  max-height: 100%;
  overflow: scroll;

  ${({ readOnly }) =>
    readOnly &&
    css`
      pointer-events: none;
    `};

  background-color: ${({ theme }) => theme.colors.background.modal};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
  ${Scroll}
`
