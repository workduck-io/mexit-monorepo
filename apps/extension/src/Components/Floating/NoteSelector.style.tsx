import styled from 'styled-components'

export const SelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  max-height: 300px;
  overflow: auto;
`
