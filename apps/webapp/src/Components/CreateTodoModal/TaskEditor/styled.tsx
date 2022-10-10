import styled from 'styled-components'

import { CheckBoxWrapper, EditorStyles } from '@mexit/shared'

import { ModalSection } from '../../../Style/Refactor'

export const TaskEditorWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing.small};
`

export const TaskEditorStyle = styled(EditorStyles)`
  min-width: 40vw;
  max-width: 40vw;
  max-height: 40vh;
  overflow-y: scroll;
  background: #333;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin: ${({ theme }) => theme.spacing.medium};
`

export const ScrollableModalSection = styled(ModalSection)`
  width: 40vw;
  max-height: 50vh;

  ${CheckBoxWrapper} {
    padding: 0;
  }
`
