import styled from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { HoverSubtleGlow, ShowOnHoverIconStyles, SubtleGlow } from './Helpers'

export const TagFlex = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: 14px;
  align-items: center;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid rgba(${({ theme }) => theme.rgbTokens.text.fade}, 0.8);

  color: ${({ theme }) => theme.tokens.text.default};

  /* ${({ theme }) => generateStyle(theme.generic.tags.tag)} */

  ${HoverSubtleGlow} ${ShowOnHoverIconStyles}
    .showOnHoverIcon {
    color: ${({ theme }) => theme.tokens.colors.primary.text};
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    ${SubtleGlow}
  }
`

export const TagFlexText = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

export const TagsFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
`

export const InfoSubHeading = styled.h2`
  margin: ${({ theme }) => theme.spacing.large};
  font-size: 1.2rem;
  font-weight: normal;
  color: ${({ theme }) => theme.tokens.text.fade};
`
