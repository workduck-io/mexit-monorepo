import styled from 'styled-components'

export const StyledLoginContainer = styled.section`
  height: fit-content;
  height: 40vh;
  width: 100%;
  display: flex;

  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.tokens.surfaces.modal};
  color: ${({ theme }) => theme.tokens.text.heading};
`

export const MexLogin = styled.span`
  padding: 0.5rem 1rem;
  margin-left: 0.75rem;

  background-color: ${({ theme }) => theme.tokens.colors.primary.default};
  color: ${({ theme }) => theme.tokens.text.heading};
  border-radius: 1rem;

  box-shadow: 0 0 5px ${({ theme }) => theme.tokens.colors.primary.default};
`
