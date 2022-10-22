import { EditorStyles } from '@mexit/shared'
import styled from 'styled-components'

export const PlatelessStyled = styled(EditorStyles)`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  gap: ${({ theme }) => theme.spacing.small};
  * {
    flex-shrink: 0;
  }
  p {
    margin: 0;
  }
  p,
  ol,
  ul,
  .code-block,
  table {
    margin-bottom: 0rem;
  }
`
