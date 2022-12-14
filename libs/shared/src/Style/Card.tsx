import styled from 'styled-components'

export const Card = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.medium};
  height: 400px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
`

export const BaseCard = styled.div`
  background: ${({ theme }) => theme.tokens.surfaces.s[1]};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  outline: none;
  padding: ${({ theme }) => theme.spacing.large};
  margin: ${({ theme }) => theme.spacing.large};
`

export const BackCard = styled(BaseCard)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  min-width: 300px;
  max-width: 600px;
`

export const FooterCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  justify-content: center;
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.medium}`};
`
