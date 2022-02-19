import styled from 'styled-components'

import { Route, Link, Routes } from 'react-router-dom'
import ColourPicker from './components/ColourPicker'
import CorporateBS from './components/CorpBS'

const StyledApp = styled.div`
  // Your style here
`

export function App() {
  return (
    <StyledApp>
      <Routes>
        <Route path="/" element={<h1>Hi Mom</h1>} />
        <Route path="/color-picker" element={<ColourPicker />} />
        <Route path="/corpbs" element={<CorporateBS />} />
      </Routes>
    </StyledApp>
  )
}

export default App
