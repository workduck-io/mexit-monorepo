import React, { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import { copyTextToClipboard , resize } from '@mexit/shared'

import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  padding: 2rem;
`

const PresetButton = styled.button<{ bg: string }>`
  background-color: ${(props) => props.bg};
  cursor: pointer;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  margin: 0.5rem 0.25rem;
`

const CurrentColor = styled.p`
  cursor: pointer;
  margin: 0;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.gray[8]};
  color: ${({ theme }) => theme.colors.primary};
  width: fit-content;
  border-radius: 5px;
`
const Wrapper = styled.div`
  margin: 0 1rem;
`

interface Colour {
  r: number
  g: number
  b: number
}

export const ColourPicker = () => {
  const [hexColor, setHexColor] = useState('#aabbcc')
  const elementRef = useRef(null)

  const presetColors = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#417505', '#9013FE']

  useEffect(() => {
    if (elementRef !== null) {
      resize(elementRef)
    }
  }, [elementRef])

  return (
    <Container ref={elementRef}>
      <div>
        <HexColorPicker color={hexColor} onChange={setHexColor} />
        {presetColors.map((presetColor) => (
          <PresetButton type="button" key={presetColor} bg={presetColor} onClick={() => setHexColor(presetColor)} />
        ))}
      </div>
      <Wrapper>
        <CurrentColor onClick={() => copyTextToClipboard(hexColor)}>{hexColor}</CurrentColor>
      </Wrapper>
    </Container>
  )
}
