import styled from 'styled-components'

import { RHSideNav } from '@mexit/shared'

export const ExtSideNav = styled(RHSideNav)`
  position: fixed;
  bottom: 0;
  right: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  background: ${({ theme }) => theme.tokens.surfaces.app};
`

export const SidebarContainer = styled.div`
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};

  position: fixed;
  z-index: 9999999999;

  font-size: 1em;
  color: ${({ theme }) => theme.tokens.text.heading};
`
