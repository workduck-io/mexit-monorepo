import styled, { css } from 'styled-components'

import { Description, IconDisplay } from '@mexit/shared'

import { ModalHeader } from '../../../Style/Refactor'

export const MangeSpacesContainer = styled.section`
  width: 30vw;
  min-width: 100%;

  ${ModalHeader} {
    margin: 0;
    margin-top: ${({ theme }) => theme.spacing.medium};
  }
`

export const SpacesListContainer = styled.div`
  max-height: 40vh;
  overflow: hidden auto;
  margin: ${({ theme }) => theme.spacing.large} 0 ${({ theme }) => theme.spacing.medium};
  gap: ${({ theme }) => theme.spacing.small};
  padding-top: ${({ theme }) => theme.spacing.small};
  border-top: 1px solid ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.separator}, 0.4)`};
`

export const StyledIconDisplay = styled(IconDisplay)`
  /* padding-top: 4px; */
`

export const SpaceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};

  ${Description} {
    font-size: 0.9rem;
  }
`

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

export const SpaceItem = styled.div<{ $hidden?: boolean }>`
  display: flex;
  align-items: center;
  opacity: 1;
  justify-content: space-between;
  box-sizing: border-box;

  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.small}`};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.25s;

  ${({ $hidden }) =>
    $hidden &&
    css`
      opacity: 0.5;
    `}

  :hover {
    border: 1px solid ${({ theme }) => theme.tokens.surfaces.separator};
  }
`
