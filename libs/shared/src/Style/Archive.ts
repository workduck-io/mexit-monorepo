import styled from 'styled-components'

export const ArchivedNode = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  width: 16rem;
  height: 8rem;
  margin: 1rem;
  background-color: ${({ theme }) => theme.colors.background.card};
`
