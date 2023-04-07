import styled from 'styled-components'

import { Group } from '../../Style/Layouts'
import { BodyFont } from '../../Style/Search'

import { MenuWrapper } from './Dropdown.style'

export const AutoCompleteSelector = styled.div<{ focusOnActive?: boolean }>`
  display: flex;
  align-items: center;
  flex: 1;
  :hover {
    cursor: pointer;
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
  }

  transition: all 0.2s ease-in-out;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const StyledLoading = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const AutoCompleteActions = styled(Group)`
  color: ${({ theme }) => theme.tokens.text.fade};

  ${BodyFont};

  * {
    color: ${({ theme }) => theme.tokens.text.fade};
    opacity: 0.8;
    white-space: nowrap;
  }
`

export const AutoCompleteInput = styled.input`
  border: none;
  ${BodyFont}
  outline: none;
  background: none;
  width: 100%;
  color: ${({ theme }) => theme.tokens.text.default};

  &:focus-visible,
  :hover,
  :focus {
    border: none;
    outline: none;
  }
`

export const AutoCompleteSuggestions = styled(MenuWrapper)`
  max-width: fit-content;
`
