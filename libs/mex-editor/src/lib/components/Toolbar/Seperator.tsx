import styled from 'styled-components';

export const Separator = styled.div`
  height: 10px;
  margin: 0 ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
`;
