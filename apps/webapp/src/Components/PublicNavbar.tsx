import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { WDLogo } from '@mexit/shared'

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 1rem 0.5rem;

  border-bottom: 1px solid #333;
`

const PublicNavbar = () => {
  return (
    <Container>
      <a href="https://workduck.io" rel="noopener noreferrer">
        <h3>Workduck</h3>
      </a>
      <WDLogo />
    </Container>
  )
}

export default PublicNavbar
