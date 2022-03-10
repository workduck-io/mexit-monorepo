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
    </Routes>
  )
}

export default Switch
