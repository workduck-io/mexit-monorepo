import { linkTooltip } from '@mexit/shared'
import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'
import { useAuthStore } from '../Stores/useAuth'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { GridWrapper } from '../Style/Grid'
import { navTooltip } from '../Style/Nav'

const AppWrapper = styled.div`
  min-height: 100%;
  overflow: hidden;
  ${navTooltip};
  ${linkTooltip};
`

const Content = styled.div<{ grid?: boolean }>`
  display: flex;
  flex-grow: 1;
  overflow: auto;
  ${({ grid }) =>
    grid &&
    css`
      grid-column-start: 2;
    `}
`

const Draggable = styled.div`
  height: 24px;
  width: 100vw;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10000;

  &:hover,
  &:active {
    background-color: ${({ theme }) => transparentize(0.85, theme.colors.primary)};
  }
`

export type MainProps = { children: React.ReactNode }

const Main = ({ children }: MainProps) => {
  const styles = {
    WebkitAppRegion: 'drag'
  }
  // const { getLinks } = useNavlinks()
  const authenticated = useAuthStore((state) => state.authenticated)
  const focusMode = useLayoutStore((s) => s.focusMode)

  // const { gridSpringProps } = useSidebarTransition()

  return (
    <AppWrapper className={focusMode.on ? 'focus_mode' : ''}>
      <Draggable style={styles as any} /> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
      <GridWrapper
        // style={gridSpringProps}
        grid={authenticated ? 'true' : ''}
      >
        {/* {authenticated && <Nav links={getLinks()} />} */}
        <Content id="wd-mex-content-view" grid={authenticated}>
          {children}
        </Content>
      </GridWrapper>
    </AppWrapper>
  )
}

export default Main
