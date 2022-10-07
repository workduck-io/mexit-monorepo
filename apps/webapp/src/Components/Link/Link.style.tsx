import { Relative } from '@mexit/shared'
import { Button } from '@workduck-io/mex-components'
import styled from 'styled-components'

export const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
`

export const LinkHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  gap: ${({ theme }) => theme.spacing.small};

  ${Relative} {
    color: ${({ theme }) => theme.colors.text.fade};
  }
`

export const LinkTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  width: min-content;

  font-size: 1.2rem;

  img {
    border-radius: 50%;
  }
`

export const LinkShortenAndTagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  gap: ${({ theme }) => theme.spacing.small};

  ${Button} {
    padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
    gap: ${({ theme }) => theme.spacing.tiny};
  }
`

export const LinkTagSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
`
