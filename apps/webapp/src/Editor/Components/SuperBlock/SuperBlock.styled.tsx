import styled, { css } from 'styled-components'

import { Input } from '@mexit/shared'

export const Container = styled.div<{ $isActive?: boolean; $isReadOnly?: boolean; $isSelected?: boolean }>`
  width: 100%;
  border-radius: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  transition: opacity 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
  padding: ${({ theme }) => theme.spacing.medium};
  overflow: hidden;

  ${({ $isReadOnly, $isSelected, $isActive }) => {
    return $isSelected || $isReadOnly
      ? css`
          opacity: 1;
          ${$isActive &&
          css`
            background: ${({ theme }) => `rgba(${theme.rgbTokens.surfaces.s[0]}, 0.4);`};
            box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
          `}
        `
      : css`
          opacity: 0.8;
        `
  }}
`

export const RenameInput = styled(Input)<{ length?: number; disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.tiny};
  border: none !important;
  background: none !important;
  margin: 0;
  min-width: 10ch;
  width: ${({ length }) => `${length}ch`};
  max-width: 40ch;
  text-overflow: ellipsis;
  margin: 0 !important;

  &:hover {
    ${({ disabled }) =>
      !disabled &&
      css`
        cursor: pointer;
        box-shadow: ${({ theme }) => theme.tokens.shadow.small};
        background: ${({ theme }) => theme.tokens.surfaces.s[2]} !important;
      `}
  }

  :disabled {
    color: ${({ theme }) => theme.tokens.text.fade} !important;
    opacity: 1 !important;
  }

  &:focus {
    color: ${({ theme }) => theme.tokens.text.default} !important;
    opacity: 1 !important;
  }
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

export const GroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const Section = styled.section<{ padding?: string; margin?: string; $width?: number }>`
  display: flex;
  flex-direction: row;

  ${({ $width }) =>
    $width < 600
      ? $width < 400
        ? css`
            #label {
              display: none;
            }
            flex-direction: column;
            align-items: flex-start;
            gap: ${({ theme }) => theme.spacing.medium};
          `
        : css`
            #label {
              display: none;
            }
          `
      : css``}

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
