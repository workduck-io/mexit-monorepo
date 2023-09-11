import styled from 'styled-components'

export const CustomHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.small};
  border-bottom: 2px solid ${({ theme }) => theme.tokens.text.fade};
  width: 100%;
`

export const CustomFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.small};
  border-top: 2px dashed ${({ theme }) => theme.tokens.text.fade};
  width: 100%;
`

export const CustomBody = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`
