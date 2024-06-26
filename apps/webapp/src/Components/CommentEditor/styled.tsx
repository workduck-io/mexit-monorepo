import styled from 'styled-components'

// import { EditorStyles } from '@mexit/shared'

export const CommentEditorWrapper = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
`
