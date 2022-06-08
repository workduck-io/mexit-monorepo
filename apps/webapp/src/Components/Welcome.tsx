import { Center, Height, StyledKeyCap, StyledTypography, Wave, WelcomeHeader } from '@mexit/shared'
import React from 'react'

import { useTheme } from 'styled-components'

const WelcomeSection = () => {
  const theme = useTheme()

  return (
    <Height>
      <Center>
        <StyledTypography size="1.5rem" color={theme.colors.text.default} margin="3rem" maxWidth="100%">
          Hey there, Mex here!
        </StyledTypography>
      </Center>
      <WelcomeHeader>
        <StyledTypography size="2rem" color={theme.colors.primary} margin="0" maxWidth="100%">
          Happy to finally meet you <Wave>👋</Wave>
        </StyledTypography>
      </WelcomeHeader>
      <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        Before I take you on a journey of all things magical, you will need to bear with me for just a few steps. Let's
        start, shall we?
      </StyledTypography>
      <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        For a seamless experience, all you need to do is remember 3 super easy shortcuts! (Just 3, promise) We can start
        by getting to know you a little ; )
      </StyledTypography>
      <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="2rem 0 0" maxWidth="100%">
        Open the browser to the last thought you wanted to quickly capture.
      </StyledTypography>
      <br />
      <Center>
        <StyledTypography size="1.1rem" color={theme.colors.text.fade} margin="0.5rem 0 2rem" maxWidth="100%">
          Select it and press <StyledKeyCap>CMD + SHIFT + L </StyledKeyCap>
        </StyledTypography>
      </Center>
    </Height>
  )
}

export default WelcomeSection
