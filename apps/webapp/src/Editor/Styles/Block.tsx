import styled, { keyframes } from 'styled-components'

export const Element = styled.span<{ show: boolean }>`
  border-radius: ${(props) => props.theme.borderRadius.tiny};
  margin: 4px 0;
  background-color: ${(props) => props.show && props.theme.tokens.surfaces.s[2]};
`

export const MoveIt = keyframes`
  0% { transform: translateX(-0.5rem);}
  100% { transform: translateX(0rem);}
`

export const BlockElement = styled.div`
  user-select: none;
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border-radius: ${(props) => props.theme.borderRadius.small};
  margin-bottom: ${(props) => props.theme.spacing.small};
  box-shadow: ${(props) => props.theme.tokens.shadow.small};
  animation: ${MoveIt} 0.1s ease-out;
  display: flex;
  align-items: center;
`

export const BlockSelectorInput = styled.input`
  border-radius: 50% !important;

  margin: 0 ${(props) => props.theme.spacing.medium} !important;
  border: none;

  :focus {
    outline: none !important;
  }
`

export const BlockModal = styled.div``
