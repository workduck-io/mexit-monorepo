import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;

  width: 0;
  height: 0;

  p {
    margin: 0 0.5em !important;
  }
`

export const StyledChotu = styled.div<{ show: boolean }>`
  display: flex;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.25em;

  cursor: pointer;

  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 25px;
  border: 2px solid ${({ theme }) => theme.colors.background.app};
  transition-property: all;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 300ms;

  background-color: #111;

  iframe {
    display: none;
  }

  &:hover {
    ${Container} {
      width: fit-content;
    }
  }
`

export const CopyButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;

  img {
    width: 16px;
    aspect-ratio: 1/1;
  }
`

export const Icon = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  aspect-ratio: 1/1;
  border-radius: 50%;
  padding: 0.25em;

  img {
    width: 16px;
    height: 16px;
  }
`
