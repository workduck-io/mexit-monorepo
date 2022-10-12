import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { HoverSubtleGlow, ShowOnHoverIconStyles, SubtleGlow } from './Helpers'

export const TagFlex = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};

  ${HoverSubtleGlow}
  ${ShowOnHoverIconStyles}
  .showOnHoverIcon {
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    background-color: ${({ theme }) => theme.colors.primary};
    ${SubtleGlow}
  }
`

export const TagFlexText = styled.div``

export const TagsFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
`

export const InfoSubHeading = styled.h2`
  margin: ${({ theme }) => theme.spacing.large};
  font-size: 1.2rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.fade};
`
