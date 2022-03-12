import styled from 'styled-components'
import { normalize } from '@mexit/shared'

export const SputlitContainer = styled.div`
  ${normalize}
  font-family: 'Inter', sans-serif;
`

export const Overlay = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 8;
  opacity: 0.6;
  transition: all 0.1s cubic-bezier(0.05, 0.03, 0.35, 1);
`

export const Wrapper = styled.div`
  position: fixed;
  width: 700px;
  border-radius: 8px;

  margin: auto;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 10;
  height: 540px;
  transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
`

export const Main = styled.div`
  position: absolute;
  width: 100%;
  background: ${({ theme }) => theme.colors.background.app};
  box-shadow: 0px 6px 20px rgb(0 0 0 / 20%);

  border-radius: 10px;
  top: 0px;
  left: 0px;
  z-index: 9;
  height: fit-content;
  transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
  display: block;
`
