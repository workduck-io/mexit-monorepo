import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import UserDropdown from './UserDropdown'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1rem 0.5rem;
  height: 100%;
  border-bottom: 1px solid #333;
`

const Navbar = () => {
  return (
    <Container>
      <Link to="/">
        <h3>Home</h3>
      </Link>
      <Link to="/search">
        <h3>Search</h3>
      </Link>
      <Link to="/snippets">
        <h3>Snippets</h3>
      </Link>
      <Link to="/settings">
        <h3>Settings</h3>
      </Link>
    </Container>
  )
}

export default Navbar
