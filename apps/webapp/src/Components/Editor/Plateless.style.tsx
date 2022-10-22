import { EditorStyles } from '@mexit/shared'
import styled from 'styled-components'

export const PlatelessStyled = styled(EditorStyles)`
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
