import { createGlobalStyle } from 'styled-components'

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

  #extension-root *{
    font-family: "Inter", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    opacity: 1;
    text-align: left;
  }
`
