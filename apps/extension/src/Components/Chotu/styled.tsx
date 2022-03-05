import styled, { css } from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;

  width: 0;
  height: 0;

  p {
    margin: 0 0.5rem !important;
  }
`

export const StyledChotu = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? css`flex` : css`none`)};
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.25rem;

  cursor: pointer;

  color: #fff;
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 1);
  transition-property: all;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 300ms;
  overflow: hidden;

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
  padding: 0.25rem;

  img {
    width: 16px;
    height: 16px;
  }
`
