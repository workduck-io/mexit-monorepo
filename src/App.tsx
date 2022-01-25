import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyle from "./shared/GlobalStyle";
import theme from "./shared/theme";
import MainArea from "./views/MainArea";

//----------Styled Components------------

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

//======================================

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <GlobalStyle />

          <Routes>
            <Route  path="/" element={<MainArea />} />
          </Routes>
        </AppContainer>
      </ThemeProvider>
    </Router>
  );
}

export default App;