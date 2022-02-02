import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    src: url(${chrome.runtime.getURL('/assets/Inter-Regular.ttf')});
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    src: url(${chrome.runtime.getURL('/assets/Inter-Medium.ttf')});
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    src: url(${chrome.runtime.getURL('/assets/Inter-SemiBold.ttf')});
  }

  @font-face {
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    src: url(${chrome.runtime.getURL('/assets/Inter-Bold.ttf')});
  }

  #extension-root *{
    /* TODO: uncommented the following line to prevent FOUT */
    /* See: https://github.com/styled-components/styled-components/issues/2227 */
    /* font-family: "Inter", sans-serif; */
    font-size: 14px;
    line-height: 1.5;
    opacity: 1;
    text-align: left;
  }
`
