import styled from 'styled-components'

import { EditorStyles } from '@mexit/shared'

export const PreviewNoteContainer = styled.section`
  width: 50vw;
  height: 50vh;
  max-height: 50vh;
  max-width: 50vw;
  
  display: flex;
  flex-direction: column;
  align-items: center;

  ${EditorStyles} {
    /* background: ${({ theme }) => theme.colors.background.app}; */
  }
`
