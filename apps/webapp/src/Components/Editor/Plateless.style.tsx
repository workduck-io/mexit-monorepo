import { EditorStyles } from '@mexit/shared'
import styled, { css } from 'styled-components'

interface PlatelessStyledProps {
  readOnly?: boolean
  multiline?: boolean
}

export const PlatelessStyled = styled(EditorStyles)<PlatelessStyledProps>`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;

  ${({ theme, multiline }) =>
    multiline
      ? css`
          flex-direction: column;
          height: 100%;
          align-items: flex-start;

          p {
            width: 100%;
          }

          b {
            font-size: 1.2rem;
          }

          blockquote {
            margin: 0;
            padding: ${({ theme }) => theme.spacing.small};
          }
        `
      : css`
          p {
            display: inline;
          }
        `}

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
