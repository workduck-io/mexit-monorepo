import styled, { css } from 'styled-components'

import { BodyFont } from '@mexit/shared'

export const Container = styled.div<{ $isActive?: boolean; $isSelected?: boolean }>`
  border-radius: ${({ theme }) => theme.spacing.medium};
  margin-bottom: 1rem;
  transition: opacity 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  padding: ${({ theme }) => theme.spacing.medium};
  ${BodyFont}
  ${({ $isSelected, $isActive }) =>
    $isSelected || $isActive
      ? css`
          opacity: 1;
          ${!$isActive &&
          css`
            background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[0]}, 0.4);`};
            box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
          `}
        `
      : css`
          opacity: 0.8;
        `}
`

export const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  opacity: 0.5;
  background: ${({ theme }) => theme.tokens.text.fade};
`

export const SectionPlaceholder = styled.section`
  display: flex;
  padding: 1.25rem;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px dotted ${({ theme }) => theme.tokens.surfaces.s[3]};
  margin: 0.25rem 0;
`

export const Section = styled.section<{ padding?: string; margin?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.spacing.small};
  transition: width 0.25s ease, background 0.25s ease;

  &:hover {
    cursor: pointer;
  }

  ${({ padding }) =>
    padding &&
    css`
      padding: ${padding};
    `}

  ${({ margin }) =>
    margin &&
    css`
      margin: ${margin};
    `}
`
