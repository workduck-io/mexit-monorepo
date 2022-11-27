import { RHSideNav } from '@mexit/shared'
import styled from 'styled-components'

export const ExtSideNav = styled(RHSideNav)`
  position: fixed;
  bottom: 0;
  right: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  background: ${({ theme }) => theme.colors.background.app};
`

export const SidebarContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.sidebar};

  position: fixed;
  z-index: 9999999999;

  color: ${({ theme }) => theme.colors.text.heading};
`
