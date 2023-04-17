import { createGlobalStyle } from 'styled-components'

import { customStyles, EditorBalloonStyles, normalize, ThinScrollbar, TippyBalloonStyles } from '@mexit/shared'

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

  #mexit-extension-iframe {
    display: none;
  }

  .highlight {
    color: ${({ theme }) => theme.tokens.text.heading};
    background: ${({ theme }) => `rgba(${theme.rgbTokens.colors.primary.default}, 0.4)`};
  }

  

  #sputlit-container, #dibba-container, #ai-preview, #mexit-tooltip, #ext-side-nav, #notif, #mexit-ai-performer {
    ${normalize}; // NormalizeCSS normalization
    letter-spacing: normal;
    font-family: "Inter", sans-serif;
    line-height: 1.5;
    font-size: 16px;

    * {
      ${ThinScrollbar}
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

    ${({ theme }) => theme.custom && customStyles[theme.custom]}
  }

  #mexit-ai-performer {
    font-size: 14px;
  }

`
