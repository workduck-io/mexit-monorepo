import { normalize } from '@mexit/shared'
import { createGlobalStyle, css } from 'styled-components'

import { ThinScrollbar } from './Helpers'
import { EditorBalloonStyles, TippyBalloonStyles } from '@mexit/shared'

import { ThemeType } from '../styled.d'

const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  ${normalize}; // NormalizeCSS normalization

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
    height: 100vh;
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
`

export default GlobalStyle
