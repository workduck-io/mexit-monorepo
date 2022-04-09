import { createGlobalStyle } from 'styled-components'
import { normalize } from '@mexit/shared'

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

  #chotu-container, #sputlit-container, #dibba-container {
    ${normalize}; // NormalizeCSS normalization
    letter-spacing: normal;
    font-family: "Inter", sans-serif;
    line-height: 1.5;
    font-size: 14px;
  }

`
