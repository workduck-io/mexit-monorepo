import { StyledInputWrapper, Button, Input } from '@mexit/shared'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;

  ${StyledInputWrapper} {
    margin: 0;
  }

  .smallTooltip {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  ${Input} {
    width: 100%;
    margin-right: ${({ theme }) => theme.spacing.small};
    &:hover,
    &:focus,
    &:active {
      border: 1px solid ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.gray[8]};
    }
  }
`

export const ButtonWrapper = styled.div`
  position: absolute;
  top: 100%;
  display: flex;
  padding: ${({ theme }) => theme.spacing.medium} 0;
  z-index: 200;

  ${Button} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

export const TitleStatic = styled.div`
  border: 1px solid transparent;
  padding: ${({ theme }) => theme.spacing.small} 8px;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-right: ${({ theme }) => theme.spacing.small};

  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.colors.gray[8]};
  }
`
