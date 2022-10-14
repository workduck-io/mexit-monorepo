import styled, { keyframes } from 'styled-components'

import { normalize } from '@mexit/shared'

export const SputlitContainer = styled.div`
  ${normalize}
  font-family: 'Inter', sans-serif;

  position: fixed;
  z-index: 9999999999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  inset: 0;
  padding: 14vh 16px 16px;
`

export const Overlay = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: -1;
  opacity: 0.6;
`

export const Wrapper = styled.div`
  width: 700px;

  overflow: hidden;
  background: ${({ theme }) => theme.colors.background.app};
  box-shadow: 0px 6px 20px rgb(0 0 0 / 20%);
  border-radius: 10px;
`

export const Main = styled.div`
  position: absolute;
  width: 100%;

  top: 0px;
  left: 0px;
  display: block;
`
