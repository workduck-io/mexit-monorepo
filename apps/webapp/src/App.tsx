import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { defaultThemes } from '@mexit/shared'

import './Stores'
import Switch from './Switch'

function App() {
  return (
    <Router>
      <ThemeProvider theme={defaultThemes[7].themeData}>
        <Switch />
      </ThemeProvider>
    </Router>
  )
}

export default App
