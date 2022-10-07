import { Button } from '@workduck-io/mex-components'
import styled from 'styled-components'

export const ShortenButton = styled(Button)`
  svg {
    flex-shrink: 0;
  }
`

export const ShortenSectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  .showOnHover {
    transition: width 0.2s ease-in-out;
    margin-left: ${({ theme }) => theme.spacing.tiny};
    width: 0%;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text.fade};
  }

  &:hover {
    .showOnHover {
      width: initial;
    }
  }
`
