import React, { useEffect, useState } from 'react'
import Editor from '../Components/Editor/Editor'

import styled from 'styled-components'
import Sidebar from '../Components/Sidebar'

const Container = styled.div`
  display: flex;
  flex: 1;
`

function MainArea() {
  return (
    <Container>
      <Sidebar />
      <Editor />
    </Container>
  )
}

export default MainArea
