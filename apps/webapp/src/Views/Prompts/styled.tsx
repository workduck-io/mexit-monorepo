import styled from 'styled-components'

import { CenteredFlex } from '@mexit/shared'

import ServiceInfo from '../../Components/Portals/ServiceInfo'

export const PromptContainer = styled(ServiceInfo)`
  width: 60vw;
  max-width: 1024px;
  margin: 0 auto;
`

export const IconContainer = styled(CenteredFlex)`
  margin: 0 1rem;

  & > span {
    padding: 1rem 2rem;
    margin: 1rem 0 2rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }

  width: auto;
  flex: none;
`
