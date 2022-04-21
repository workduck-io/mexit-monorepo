import React from 'react'
import styled from 'styled-components'
import { ROUTE_PATHS } from '../Hooks/useRouting'

const Container = styled.div`
  text-align: center;
  padding: 2rem 0;

  border-top: 1px solid #333;
`

const Anchor = styled.a`
  color: #3291ff;
  text-decoration: none;
`

function Footer() {
  return (
    <Container>
      {window.location.pathname === ROUTE_PATHS.login ? (
        <>
          <Anchor href={ROUTE_PATHS.register}>Don't have an account? Sign up</Anchor>
          <Anchor> | </Anchor>
          <Anchor href={ROUTE_PATHS.forgotpassword}>Forgot Password? </Anchor>
        </>
      ) : (
        <Anchor href={ROUTE_PATHS.login}>Already have an account? Log in </Anchor>
      )}
    </Container>
  )
}

export default Footer
