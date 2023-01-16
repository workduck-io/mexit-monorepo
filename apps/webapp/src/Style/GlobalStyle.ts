import { createGlobalStyle, css } from 'styled-components'

import {
  customStyles,
  EditorBalloonStyles,
  GridWrapper,
  normalize,
  ThinScrollbar,
  TippyBalloonStyles
} from '@mexit/shared'

import { ModalStyles } from './Refactor'

const GlobalStyle = createGlobalStyle`
  ${normalize}; // NormalizeCSS normalization

  /* Styles for modals */
  ${ModalStyles}

  input:focus-visible {
    outline: ${({ theme }) => theme.tokens.colors.primary.default} solid 1px;
  }

  *::selection {
    color: ${({ theme }) => theme.tokens.text.heading};
    background: rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.25);
  }

  *::placeholder {
    color: ${({ theme }) => theme.tokens.text.fade};
    opacity: 0.5;
  }

  html {
    font-size: 16px;
  }


  * {
    box-sizing: border-box;
  }

  button {
    border: none;
  }

  body {
    height: 100vh;
    width: 100vw;
    display: flex;
    overflow: hidden;
    font-family: Inter, sans-serif;
    color: ${({ theme }) => theme.tokens.text.heading};
    ${({ theme }) => {
      if (theme.backgroundImages) {
        return css`
          background-color: ${({ theme }) => theme.app.surface};
          background-image: url(${theme.backgroundImages.app});
          background-size: cover;
        `
      }

      return css`
        background: ${({ theme }) => theme.app.surface};
      `
    }}

    * {
      ${ThinScrollbar};
    }
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.tokens.colors.primary.default};

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }

  #root {
    width: 100%;
  }

  /* Tippy Balloon styles */
  ${TippyBalloonStyles}

  /* Editor Balloon styles */
  ${EditorBalloonStyles}

  body > ul[role="listbox"]{
    display: block;
    /* list-style-type: disc; */
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 0px;
  }

  button {
    &:focus-visible {
      outline: ${({ theme }) => theme.tokens.colors.primary.default} solid 1px;
    }
  }

  #floating-picker-root {
    z-index: 100000;
  }

  ${({ theme }) => theme.custom && customStyles[theme.custom]}

  /* The margin added to grid wrapper by spaceBlocks was resulting in unnecessary margin causing offcenter content and scroll */
  ${({ theme }) => {
    if (
      theme?.custom &&
      (window.location.pathname.startsWith('/share') || window.location.pathname.startsWith('/actions'))
    ) {
      return css`
        ${GridWrapper} {
          margin: 0;
        }
      `
    }
  }}
`

export default GlobalStyle
