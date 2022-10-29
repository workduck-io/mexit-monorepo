import styled from 'styled-components'

import { TextAreaBlock } from '@mexit/shared'

export const SourceHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  width: 100%;
  justify-content: space-between;

  img {
    border-radius: 50%;
    padding: 4px;
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

export const FormText = styled(TextAreaBlock)`
  width: 100%;
`
