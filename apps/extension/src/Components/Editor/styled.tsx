import styled from 'styled-components'
import { Scroll } from '../Results/styled'

export const EditorWrapper = styled.div`
  flex: 1;
  max-height: 100%;
  overflow: scroll;
  margin: 1em;
  padding: 1em;

  background-color: ${({ theme }) => theme.colors.background.modal};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
  ${Scroll}
`
