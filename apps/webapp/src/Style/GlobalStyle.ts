import { createGlobalStyle, css } from 'styled-components'

import { EditorBalloonStyles, TippyBalloonStyles, normalize, ThinScrollbar, GridWrapper } from '@mexit/shared'
import { customStyles } from '@mexit/shared'

import { ModalStyles } from './Refactor'

const GlobalStyle = createGlobalStyle`
  ${normalize}; // NormalizeCSS normalization

  /* Styles for modals */
  ${ModalStyles}

  input:focus-visible {
    outline: ${({ theme }) => theme.colors.primary} solid 1px;
  }

  *::placeholder {
    color: ${({ theme }) => theme.colors.text.fade};
    opacity: 0.5;
  }


  * {
    box-sizing: border-box;
  }

  body {
    height: 100%;
    width: 100vw;
    display: flex;
    font-family: Inter, sans-serif;
    color: ${({ theme }) => theme.colors.text.heading};
    ${({ theme }) => {
      if (theme.backgroundImages) {
        return css`
          background-color: ${({ theme }) => theme.colors.background.app};
          background-image: url(${theme.backgroundImages.app});
          background-size: cover;
        `
      }

      return css`
        background: ${({ theme }) => theme.colors.background.app};
      `
    }}

    * {
      ${ThinScrollbar};
    }
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${({ theme }) => theme.colors.primary};
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
    border: none;
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
