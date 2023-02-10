import styled from 'styled-components'

import { BodyFont, GenericFlex, RHSideNav } from '@mexit/shared'

export const ExtSideNav = styled(RHSideNav)`
  position: fixed;
  bottom: 0;
  right: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.tokens.surfaces.s[0]} 0%,
    ${({ theme }) => theme.tokens.surfaces.s[2]} 100%
  );
`

export const SubHeading = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.tokens.text.heading};
`

export const StyledSidebarSection = styled.section`
  display: flex;
  flex-direction: column;
`

export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: ${({ theme }) => theme.spacing.small} 0;

  ${GenericFlex} {
    ${BodyFont}
    font-weight: 600;
    opacity: 0.4;
    line-height: 1.5rem;
    color: ${({ theme }) => theme.tokens.text.fade};
  }
`

export const ExtensionHeaderStyled = styled.section`
  display: flex;
  width: 100%;
  align-items: center;
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.medium};
`

export const SidebarContainer = styled.div`
  position: fixed;
  z-index: 9999999999;

  font-size: 1em;
  color: ${({ theme }) => theme.tokens.text.heading};
`
