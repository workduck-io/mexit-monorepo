import styled from 'styled-components'

import { PrimaryText } from '@mexit/shared'

export const LoginContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  font-weight: bolder;
  color: ${({ theme }) => theme.tokens.text.default};

  ${PrimaryText} {
    cursor: pointer;
  }
`
