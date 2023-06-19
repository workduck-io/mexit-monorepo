import styled from 'styled-components'

export const Container = styled.div`
  padding: 1rem;
  border-radius: ${({ theme }) => theme.spacing.medium};
  background: ${({ theme }) => theme.tokens.surfaces.s[1]};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  margin: 0 0.25rem 0.25rem 0;
`
