import styled from 'styled-components'

export const StyledTopNavigation = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  justify-content: space-between;
`
