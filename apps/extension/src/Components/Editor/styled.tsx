import styled from 'styled-components'

export const EditorWrapper = styled.div`
  flex: 1;
  max-height: 100%;
  overflow: scroll;
  margin: 1rem;
  padding: 1rem;

  background-color: ${({ theme }) => theme.colors.background.modal};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
`
