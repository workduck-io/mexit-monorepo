import styled from 'styled-components'

import { Route, Link, Routes } from 'react-router-dom'
import ColourPicker from './components/ColourPicker'
import CorporateBS from './components/CorpBS'
import CurrencyConverter from './components/CurrencyConverter'
import UnixEpochConverter from './components/UnixEpoch'
import AliasWrapper from './components/AliasWrapper'

const StyledApp = styled.div`
  // Your style here
`

export function App() {
  return (
    <StyledApp>
      <Routes>
        {/* TODO: better to keep the path as the id of the action maybe? */}
        <Route path="/" element={<h1>Hi Mom</h1>} />
        <Route path="/shortner" element={<AliasWrapper />} />
        <Route path="/color-picker" element={<ColourPicker />} />
        <Route path="/corpbs" element={<CorporateBS />} />
        <Route path="/currency-convertor" element={<CurrencyConverter />} />
        <Route path="/epoch" element={<UnixEpochConverter />} />
      </Routes>
    </StyledApp>
  )
}

export default App
