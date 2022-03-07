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
  padding: 1rem;

  font-size: 1.25rem;
  color: #6968d2;
`

export const StyledInput = styled.input<{ disabled?: boolean }>`
  ${StyledBackground}
  font-size: 1rem;
  border-radius: 10px;
  padding: 10px;

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

export const StyledSearch = styled.section`
  ${Draggable}
  ${StyledBackground}
  padding: 5px;
  display: flex;
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
  height: 100%;
  color: #888;
  padding-left: 8px;
`
