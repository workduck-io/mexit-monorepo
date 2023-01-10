import styled from 'styled-components'

import { CenteredFlex, ServiceContainer } from '@mexit/shared'

import ServiceInfo from '../../Components/Portals/ServiceInfo'

export const PromptContainer = styled(ServiceInfo)`
  ${ServiceContainer} {
    width: 90vw;
    max-width: 1440px;
    margin: 0 auto;
  }
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

export const RecentPromptResultsContainer = styled.section`
  border-top: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
`

export const ResultsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
`

export const ResultEditorWrapper = styled.div`
  height: 40vh;
  max-height: 40vh;
  max-width: 36vw;
  overflow: hidden auto;
`

export const ResultPreviewContainer = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing.small};
  width: 350px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.highlight};
  box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  transition: box-shadow 0.2s ease-in-out;

  > span {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    z-index: 1;
  }

  :hover {
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  }
`
