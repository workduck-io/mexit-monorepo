import styled from 'styled-components'

import { Label, TextAreaBlock } from '@mexit/shared'

export const SourceHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  width: 100%;
  justify-content: space-between;

  * > ${Label} {
    margin: 0;
  }

  img {
    border-radius: 50%;
    padding: 1px;
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }
`

export const FormText = styled(TextAreaBlock)`
  width: 100%;
`
