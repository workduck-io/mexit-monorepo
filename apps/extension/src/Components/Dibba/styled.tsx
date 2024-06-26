import styled, { css } from 'styled-components'

export const ComboboxRoot = styled.ul<{
  isOpen: boolean
  top: number
  left: number
  offsetTop: boolean
  offsetRight: boolean
}>`
  ${({ isOpen, theme, top, left, offsetTop, offsetRight }) =>
    isOpen &&
    css`
      display: flex;
      top: calc(${top}px + 1em);
      left: ${left}px;
      position: absolute;
      padding: 1rem;
      margin: 0;
      z-index: 9999999;
      /* width: 225px; */
      overflow: hidden;
      height: fit-content;
      gap: ${({ theme }) => theme.spacing.small};

      border-radius: 8px;
      /* box-shadow: rgba(0, 0, 0, 0.133) 0 3.2px 7.2px 0, rgba(0, 0, 0, 0.11) 0 0.6px 1.8px 0; */

      transform: ${offsetTop ? css`translateY(calc(-100% - 1em))` : ''} ${offsetRight ? css`translateX(-100%)` : ''};

      > div {
        background: ${theme.tokens.surfaces.modal};
        /* height: fit-content; */
        /* max-height: 400px; */
        box-shadow: rgba(0, 0, 0, 0.133) 0 3.2px 7.2px 0, rgba(0, 0, 0, 0.11) 0 0.6px 1.8px 0;
        border-radius: ${theme.borderRadius.small};

        > section {
          max-height: 30vh;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }

      #List {
        height: fit-content;
      }
    `}
`

export const ItemTitle = styled.div``

export const ComboboxItem = styled.div<{ highlighted: boolean }>`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${(props) => props.theme.tokens.text.default};
  gap: ${({ theme }) => theme.spacing.tiny};

  font-weight: 400;
  padding: 0 8px;
  min-height: 36px;
  user-select: none;
  width: 225px;
  border-radius: ${({ theme }) => theme.borderRadius.small};

  margin: 0 ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.tokens.text.subheading};
  background: ${({ highlighted, theme }) => (!highlighted ? 'transparent' : theme.tokens.surfaces.s[3])};
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }

  & > svg {
    color: ${({ theme }) => theme.tokens.text.fade};
  }
`
