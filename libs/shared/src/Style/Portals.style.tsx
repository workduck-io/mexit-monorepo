import { Button } from '@workduck-io/mex-components'

import { CenteredMainContent } from './Editor'
import { FlexBetween } from './FloatingButton.style'
import { CardShadow } from './Helpers'
import { CenteredFlex, IntegrationTitle } from './Integrations'
import { BodyFont } from './Search'
import styled, { css } from 'styled-components'

export const ServiceContainer = styled(CenteredMainContent)``

export const CardStyles = css`
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[8]};
`

export const PortalDescription = styled.p`
  margin: 0 1rem;
  ${BodyFont};
  font-weight: 400;
  white-space: nowrap;
  overflow-x: hidden;
  color: ${({ theme }) => theme.colors.text.fade};
  opacity: 0.7;
  text-overflow: ellipsis;
`

export const GroupHeaderContainer = styled.section`
  ${CardStyles}
  ${CardShadow}
  position: relative;

  margin-top: 1rem;
  user-select: none;

  & > div {
    display: flex;
    padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
    gap: ${({ theme }) => theme.spacing.medium};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    justify-content: space-evenly;
  }

  height: fit-content;
`

export const ServiceDescription = styled.p`
  margin: 0 1rem 0 0;
  font-size: 1rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.default};
`

export const ActionGroupIcon = styled(CenteredFlex)`
  margin: 0 1rem;

  ${Button} {
    width: 100%;
  }

  & > span {
    padding: 1rem 2rem;
    margin: 1rem 0 2rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

export const GroupHeader = styled.div<{ connected?: boolean }>`
  ${IntegrationTitle} {
    padding: 0;
    font-size: 2.5rem;
  }

  ${FlexBetween} {
    padding-right: 1rem;
  }

  ${Button} {
    padding: 0.5rem 0.75rem;
    ${({ connected, theme }) =>
      connected &&
      css`
        background: transparentize(0.6, theme.colors.background.app);
        color: theme.colors.text.heading;
        cursor: default;
        :hover {
          box-shadow: none;
        }
      `}
  }
`

export const FloatingIcon = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
`

export const ActionsContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.large};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  width: 100%;
  overflow: hidden auto;
  max-height: 60vh;

  & > header {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text.fade};
    font-weight: 700;
    padding: 1rem 0.5rem 1.5rem;
  }
`

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  padding: 0.75rem ${({ theme }) => theme.spacing.small};

  /* border-radius: ${({ theme }) => theme.borderRadius.small}; */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[7]};

  ${ActionGroupIcon} {
    flex: none;
    width: auto;
  }

  section {
    padding: 0 ${({ theme }) => theme.spacing.small};
  }

  h4 {
    margin: 0;
    font-size: medium;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text.default};
  }

  ${PortalDescription} {
    font-size: 0.8rem;
  }
`
