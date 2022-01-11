import React from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Logo = styled.img`
  height: 40vmin;
  pointer-events: none;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${spin} infinite 20s linear;
  }
`;

const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

function App() {
  return (
    <Container>
      <Header>
        <Logo src="/logo.svg" alt="logo" />
        <p>Hello, World!</p>
      </Header>
    </Container>
  );
}

export default App;
