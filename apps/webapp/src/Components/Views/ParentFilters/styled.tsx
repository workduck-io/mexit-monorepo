import styled, { css } from 'styled-components'

import { BodyFont, Group } from '@mexit/shared'

export const StyledParentFilters = styled.section<{ $noMargin: boolean }>`
  ${({ $noMargin }) =>
    !$noMargin &&
    css`
      margin: ${({ theme }) => theme.spacing.medium} 0;
      padding: ${({ theme }) => theme.spacing.medium};
    `}

  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  flex-direction: column;

  opacity: 0.8;
  color: ${({ theme }) => theme.tokens.text.fade};

  > ${Group} {
    ${BodyFont}
  }

  user-select: none;
  gap: ${({ theme }) => theme.spacing.medium};
  background-color: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[2]}, 0.7);
`

export const ParentFilter = styled(Group)`
  background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const ParentFilterContainer = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const ParentFiltersGrouped = styled(Group)`
  transition: background 0.25s ease-in-out;
  ${BodyFont}

  :hover {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    cursor: pointer;
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
`

export const CloseContainer = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
`
