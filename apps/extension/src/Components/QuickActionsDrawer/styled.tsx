import styled from 'styled-components'

import { DRAWER_HEIGHT_STATES } from '@mexit/shared'

export const QuickActionsDrawerContainer = styled.div``

export const DrawerContent = styled.div`
  max-height: calc(${DRAWER_HEIGHT_STATES.NORMAL} - 7em);
  margin-top: ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`
