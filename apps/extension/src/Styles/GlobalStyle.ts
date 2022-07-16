import { createGlobalStyle } from 'styled-components'
import { customStyles, EditorBalloonStyles, normalize, TippyBalloonStyles } from '@mexit/shared'

export const GlobalStyle = createGlobalStyle`

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    src: url(${chrome.runtime.getURL('/Assets/Inter-Regular.ttf')});
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    src: url(${chrome.runtime.getURL('/Assets/Inter-Medium.ttf')});
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    src: url(${chrome.runtime.getURL('/Assets/Inter-SemiBold.ttf')});
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    src: url(${chrome.runtime.getURL('/Assets/Inter-Bold.ttf')});
  }

  #chotu-container, #sputlit-container, #dibba-container, #mexit-tooltip {
    ${normalize}; // NormalizeCSS normalization
    letter-spacing: normal;
    font-family: "Inter", sans-serif;
    line-height: 1.5;
    font-size: 14px;


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

    ${({ theme }) => theme.custom && customStyles[theme.custom]}
  }

`
