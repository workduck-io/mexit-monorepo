import styled from 'styled-components'

import { RHSideNav } from '@mexit/shared'

export const ExtSideNav = styled(RHSideNav)`
  position: fixed;
  bottom: 0;
  right: 0;
  overflow: hidden;
  overscroll-behavior: contain;
`

export const SidebarContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.app};

  position: fixed;
  z-index: 9999999999;

  color: ${({ theme }) => theme.colors.text.heading};
`
