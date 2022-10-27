import styled from 'styled-components'

export const PopoverWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.default};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-align: left;
  width: max-content;
  max-width: 600px;
`
