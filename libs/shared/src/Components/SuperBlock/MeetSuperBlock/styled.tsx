import styled from 'styled-components'

import { BodyFont } from '../../../Style/Search'

export const StyledMeetContainer = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  gap: ${({ theme }) => theme.spacing.medium};

  border-radius: ${({ theme }) => theme.borderRadius.small};

  a {
    color: ${({ theme }) => theme.tokens.text.default};
    margin: 0;
    text-decoration: none;
  }

  background-color: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.modal}, 0.7)`};

  div {
    ${BodyFont}
  }

  :hover {
    cursor: pointer;
    a {
      color: ${({ theme }) => theme.tokens.text.fade};
    }
  }
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`
