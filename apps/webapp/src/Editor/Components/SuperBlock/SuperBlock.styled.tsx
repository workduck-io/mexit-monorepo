import styled, { css } from 'styled-components'

import { BodyFont } from '@mexit/shared'

export const Container = styled.div<{ $isActive?: boolean; $isReadOnly?: boolean; $isSelected?: boolean }>`
  width: 100%;
  border-radius: ${({ theme }) => theme.spacing.medium};
  margin-bottom: 1rem;
  transition: opacity 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  padding: ${({ theme }) => theme.spacing.medium};
  ${BodyFont}

  ${({ $isReadOnly, $isSelected, $isActive }) =>
    !$isReadOnly
      ? $isSelected && $isActive
        ? css`
            opacity: 1;
            background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[0]}, 0.4);`};
            box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
          `
        : css`
            opacity: 0.8;
          `
      : css`
          opacity: 1;
          pointer-events: none;
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
  user-select: none;
  transition: width 0.25s ease, background 0.25s ease;

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
