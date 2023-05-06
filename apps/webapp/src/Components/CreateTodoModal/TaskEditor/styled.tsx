import styled from 'styled-components'

import { CheckBoxWrapper, EditorStyles } from '@mexit/shared'

import { ModalSection } from '../../../Style/Refactor'

export const TaskEditorWrapper = styled.section<{ withMaxHeight?: boolean }>`
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.tokens.surfaces.app};
  margin: ${({ theme }) => theme.spacing.large} 0;
  ${({ withMaxHeight }) => withMaxHeight && `height: 22vh;`}
  max-height: 24vh;
  overflow: hidden auto;
`

export const TaskEditorStyle = styled(EditorStyles)`
  min-width: 40vw;
  max-width: 40vw;
  max-height: 40vh;
  overflow-y: auto;
  background: #333;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin: ${({ theme }) => theme.spacing.medium};
`

export const ScrollableModalSection = styled(ModalSection)`
  width: 40vw;
  min-width: 600px;
  max-height: 50vh;

  ${CheckBoxWrapper} {
    padding: 0;
  }
`
