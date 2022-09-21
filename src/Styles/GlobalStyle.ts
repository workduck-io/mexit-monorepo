import { createGlobalStyle, css } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    height: 100%;
    width: 100vw;
    display: flex;
    font-family: Inter, sans-serif;
  }

  #root {
    width: 100%;
  }
`

export default GlobalStyle
