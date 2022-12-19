import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { Input, StyledInputWrapper } from '@mexit/shared'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;

  ${StyledInputWrapper} {
    margin: 0;
  }

  .smallTooltip {
    background: ${({ theme }) => theme.tokens.surfaces.tooltip.info};
  }

  ${Input} {
    width: 100%;
    margin-right: ${({ theme }) => theme.spacing.small};
    font-size: 2.488rem;
    font-weight: bold;
    border: 1px solid transparent;
    color: ${({ theme }) => theme.tokens.text.heading};
    &:hover,
    &:focus,
    &:active {
      color: ${({ theme }) => theme.tokens.text.heading};
      border: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
`

export const ButtonWrapper = styled.div`
  position: absolute;
  top: 100%;
  display: flex;
  padding: ${({ theme }) => theme.spacing.medium} 0;

  ${Button} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

export const TitleStatic = styled.div`
  border: 1px solid transparent;
  padding: ${({ theme }) => theme.spacing.small} 8px;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-right: ${({ theme }) => theme.spacing.small};
  font-size: 2.488rem;
  font-weight: bold;

  width: 100%;
  margin-right: ${({ theme }) => theme.spacing.small};
  font-size: 2.488rem;
  font-weight: bold;
  border: 1px solid transparent;
  &:hover,
  &:focus,
  &:active {
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    border: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
  }
`
