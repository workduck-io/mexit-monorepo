import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { Group } from '@mexit/shared'

import { ModalSection } from '../../../Style/Refactor'

export const ModalSectionContainer = styled(ModalSection)`
  gap: ${({ theme }) => theme.spacing.small};
  display: flex;
  flex-direction: column;
  max-width: 40vw;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Title = styled.h1<{ colored?: boolean }>`
  ${({ theme, colored }) =>
    colored &&
    css`
      color: ${theme.tokens.colors.primary.default};
    `}
  display: flex;
  align-items: center;
  white-space: nowrap;
  gap: ${({ theme }) => theme.spacing.small};
`

export const MoveSpaceSection = styled.section`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  box-sizing: border-box;
  margin: ${({ theme }) => theme.spacing.large} 0 0;

  ${Group} {
    padding: ${({ theme }) => theme.spacing.small} 0;
  }

  input[type='checkbox'] {
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    /* Remove most all native input styles */
    appearance: none;
    /* For iOS < 15 */
    ${({ theme }) => generateStyle(theme.editor.elements.todo.checkbox)}
    /* Not removed via appearance */

    font: inherit;
    color: currentColor;
    width: 0.6em;
    height: 0.6em;
    padding: 0.5em;
    border: 1px solid ${({ theme }) => theme.tokens.surfaces.separator};

    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    transform: translateY(-0.075em);

    display: grid;
    place-content: center;

    &:hover {
      background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
      border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[4]};
    }

    &::before {
      content: '';
      width: 0.5em;
      height: 0.5em;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transform-origin: bottom left;
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em ${({ theme }) => theme.tokens.colors.primary.default};
      /* Windows High Contrast Mode */
      background-color: CanvasText;
    }
    &:checked {
      border: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
    }
    &:checked::before {
      transform: scale(1);
    }

    &:focus {
      outline: max(1px, 0.1em) solid ${({ theme }) => theme.tokens.colors.primary.default};
      outline-offset: max(1px, 0.1em);
    }

    &:disabled {
      --form-control-color: ${({ theme }) => theme.tokens.text.disabled};

      color: ${({ theme }) => theme.tokens.text.disabled};
      cursor: not-allowed;
    }
  }
`

export const DeletionWarning = styled.div<{ align?: boolean }>`
  ${({ align }) =>
    align &&
    css`
      text-align: center;
    `}

  line-height: 1.4;
  color: ${({ theme }) => theme.tokens.text.fade};
`
