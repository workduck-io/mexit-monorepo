import { createGlobalStyle, css } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    display: flex;
    align-items: center;

    height: 100vh;
    width: 100vw;
    margin: 0;

    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    background-color: #C287E8;
    color: #0E1428;
  }

  a {
    text-decoration: none;
    color: #ffcc32;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`

export default GlobalStyle
