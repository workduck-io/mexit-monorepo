import { HeadlessButton } from '../../../../Styles/Buttons'
import styled, { css } from 'styled-components'

export const LinkButtonStyled = styled.span<{ focused: boolean }>`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  align-self: middle;
  padding: ${({ theme }) => theme.spacing.tiny} 0;

  user-select: all;

  form {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: ${({ theme }) => theme.borderRadius.tiny};

    ${HeadlessButton} {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ theme }) => theme.colors.text.default};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
    }
    input {
      width: 0px;
      opacity: 0;
      transition: opacity 0.2s ease, width 0.2s ease;
      color: ${({ theme }) => theme.colors.text.subheading};
      border: none;
      outline: none;
      background: transparent;
      height: 1.5rem;
      &::placeholder {
        color: ${({ theme }) => theme.colors.text.fade};
        opacity: 0.5;
      }
    }

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.gray[9]};
      border: 1px solid ${({ theme }) => theme.colors.primary};
      input {
        width: inherit;
        opacity: 1;
      }
    }
    ${({ focused }) =>
      focused &&
      css`
        input {
          width: inherit;
          opacity: 1;
        }
      `}
  }
`
