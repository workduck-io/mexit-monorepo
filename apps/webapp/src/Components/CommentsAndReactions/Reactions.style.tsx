import styled, { keyframes } from 'styled-components'

//

const expandOnClick = keyframes`
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.25);
  }
`

export const ReactionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny};
`

export const ReactionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[8]};
  }

  &:active {
    background: ${({ theme }) => theme.colors.gray[7]};
    animation: ${expandOnClick} 0.2s ease-in-out;
  }
`

export const ReactionCount = styled.span`
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.9rem;
`
