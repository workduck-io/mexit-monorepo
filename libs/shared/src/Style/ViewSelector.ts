import styled from 'styled-components'

export const ViewSelectorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* padding: ${({ theme }) => theme.spacing.small}; */
  gap: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const ViewSelectorButton = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme, selected }) => (selected ? theme.tokens.colors.primary.text : theme.tokens.text.fade)};
  background-color: ${({ selected, theme }) =>
    selected ? theme.tokens.colors.primary.default : theme.tokens.surfaces.s[2]};

  svg {
    width: 1rem;
    height: 1rem;
    color: ${({ theme, selected }) =>
      selected ? theme.tokens.colors.primary.text : theme.tokens.colors.primary.default};
  }
`
