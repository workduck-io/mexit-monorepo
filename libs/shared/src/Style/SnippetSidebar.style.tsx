import styled from 'styled-components'

import { Ellipsis } from './NodeSelect.style'

export const SnippetCards = styled.div`
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  flex-direction: column;
`

export const SnippetCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.spacing.medium};
`

export const SnippetCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  font-size: 1.15rem;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const SnippetCardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.tiny};

  color: ${({ theme }) => theme.colors.text.fade};
`

export const SnippetContentPreview = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
  ${Ellipsis}
`
