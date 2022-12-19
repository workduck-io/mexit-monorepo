import React from 'react'

import styled from 'styled-components'

import { MexThemeData } from '@workduck-io/mex-themes'

interface ThemeDemoProps {
  theme: MexThemeData
}

const StyledTheme = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  width: min-content;
  overflow: hidden;

  svg {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const ThemeDemo = ({ theme }: ThemeDemoProps) => {
  const dark = {
    background: theme.data['dark'].surfaces.app,
    primary: theme.data['dark'].colors.primary.default,
    secondary: theme.data['dark'].colors.secondary,
    gray1: theme.data['dark'].text.fade,
    gray2: theme.data['dark'].text.accent,
    gray3: theme.data['dark'].text.default,
    gray4: theme.data['dark'].text.heading
  }

  const light = {
    background: theme.data['light'].surfaces.app,
    primary: theme.data['light'].colors.primary.default,
    secondary: theme.data['light'].colors.secondary,
    gray1: theme.data['light'].text.fade,
    gray2: theme.data['light'].text.accent,
    gray3: theme.data['light'].text.default,
    gray4: theme.data['light'].text.heading
  }

  return (
    <StyledTheme>
      <svg width="357" height="294" viewBox="0 0 357 294" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_425_416)">
          <rect width="357" height="294" fill={dark.background} />
          <path
            d="M53.5 151C22.2379 140.637 -24 151 -24 151L-9 316.5H366V151C366 151 311.448 116.517 274 129.5C251.972 137.137 243.694 151.632 220.5 154C195.213 156.582 179.556 147.281 154.5 143C114.738 136.207 91.789 163.693 53.5 151Z"
            fill={light.background}
          />
          <rect x="20" y="20" width="111" height="111" rx="12" fill={dark.primary} />
          <circle cx="198" cy="75.5" r="50" fill={dark.secondary} />
          <circle cx="281" cy="95.5" r="16" fill={dark.gray1} />
          <circle cx="321" cy="95.5" r="16" fill={dark.gray2} />
          <circle cx="321" cy="55.5" r="16" fill={dark.gray3} />
          <circle cx="281" cy="55.5" r="16" fill={dark.gray4} />
          <circle cx="36" cy="238.5" r="16" fill={light.gray1} />
          <circle cx="76" cy="238.5" r="16" fill={light.gray2} />
          <circle cx="76" cy="198.5" r="16" fill={light.gray3} />
          <circle cx="36" cy="198.5" r="16" fill={light.gray4} />
          <circle cx="159" cy="218.5" r="50" transform="rotate(-180 159 218.5)" fill={light.secondary} />
          <rect
            x="337"
            y="274"
            width="111"
            height="111"
            rx="12"
            transform="rotate(-180 337 274)"
            fill={light.primary}
          />
        </g>
        <defs>
          <clipPath id="clip0_425_416">
            <rect width="357" height="294" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </StyledTheme>
  )
}

export default ThemeDemo
