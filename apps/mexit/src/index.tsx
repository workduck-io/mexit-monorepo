import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import Popup from './Popup'
import { GlobalStyle } from './Styles/GlobalStyle'
import { theme } from './Styles/theme'

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Popup />
  </ThemeProvider>,

  document.getElementById('root')
)
