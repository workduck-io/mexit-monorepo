import styled from 'styled-components'
import { Scroll } from '../Results/styled'

export const EditorWrapper = styled.div`
  flex: 1;
  /* display: grid so that mex-editor takes up all the space */
  display: grid;
  max-height: 100%;
  overflow: scroll;
  margin: 1rem;
  padding: 1rem;

  background-color: ${({ theme }) => theme.colors.background.modal};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
  ${Scroll}
`
