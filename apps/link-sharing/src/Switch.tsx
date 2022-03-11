import React from 'react'
import { Route, Routes } from 'react-router-dom'

import MainArea from './Views/MainArea'
import PublicNode from './Views/PublicNode'

const Switch = () => {
  return (
    <Routes>
      <Route path="/" element={<MainArea />}>
        <Route path=":nodeId" element={<PublicNode />} />
      </Route>
      <Route path="/404" element={<h1>Page Not Found</h1>} />
    </Routes>
  )
}

export default Switch
