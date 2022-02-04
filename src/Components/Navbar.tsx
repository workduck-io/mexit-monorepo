import React from 'react'
import styled from 'styled-components'
import UserDropdown from './UserDropdown'

const Container = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 1rem 0.5rem;

  border-bottom: 1px solid #333;
`

function Navbar() {
  return (
    <Container>
      <h3>Home</h3>

      <UserDropdown />
    </Container>
  )
}

export default Navbar
