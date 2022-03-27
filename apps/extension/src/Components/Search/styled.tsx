import styled, { css } from 'styled-components'

export const StyledBackground = css`
  background-color: ${({ theme }) => theme.colors.background.modal};
`

export const Draggable = css`
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
`

export const QuerySearch = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5rem;

  font-size: 1.25rem;
  color: #6968d2;
`

export const StyledInput = styled.input<{ disabled?: boolean }>`
  ${StyledBackground}
  border-radius: 10px;
  padding: 0.75rem;

  flex: 1;
  border: none;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text.disabled : theme.colors.text.fade)};
  ${({ disabled }) =>
    disabled &&
    css`
      font-weight: bolder;
      ::placeholder {
        color: ${({ theme }) => theme.colors.primary};
      }
    `}
  :focus {
    outline: none;
  }
`

export const StyledSearch = styled.div`
  ${Draggable}
  ${StyledBackground}
  padding: 5px;
  display: flex;
  font-size: 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin: 0.7rem;
`

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CenterIcon = styled(Center)<{ cursor?: boolean }>`
  ${({ cursor }) =>
    cursor &&
    css`
      cursor: pointer;
    `}

  color: #888;
  padding-left: 8px;

  svg {
    height: 33px;
    aspect-ratio: 1/1;
  }
`
