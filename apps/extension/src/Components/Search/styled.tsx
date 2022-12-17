import styled, { css } from 'styled-components'

export const StyledBackground = css`
  background-color: ${({ theme }) => theme.tokens.surfaces.modal};
`

export const Draggable = css`
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
`

export const QuerySearch = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5em;

  font-size: 1.25em;
  color: #6968d2;
`

export const StyledInput = styled.input<{ disabled?: boolean }>`
  ${StyledBackground}
  border-radius: 10px;
  padding: 0.75em;

  flex: 1;
  border: none;
  color: ${({ theme, disabled }) => (disabled ? theme.tokens.text.disabled : theme.tokens.text.fade)};
  ${({ disabled }) =>
    disabled &&
    css`
      font-weight: bolder;
      ::placeholder {
        color: ${({ theme }) => theme.tokens.colors.primary.default};
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
  font-size: 1em;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin: 0.7em;
`

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CenterIcon = styled(Center)<{ $cursor?: boolean }>`
  ${({ $cursor }) =>
    $cursor &&
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
