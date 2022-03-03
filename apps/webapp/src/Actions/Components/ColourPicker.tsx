import React, { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import styled from 'styled-components'
import { Toaster } from 'react-hot-toast'

import { copyToClipboard, Input, throttle } from '@mexit/shared'

import { resize } from '../../Utils/helper'

const Container = styled.div`
  display: flex;
  margin: 2rem;
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
  background: #ccc;
  width: fit-content;
  border-radius: 5px; ;
`

const Form = styled.form`
  display: flex;
  justify-content: space-evenly;
  margin: 1rem 0;
  width: 100%;

  input {
    width: 25%;
    margin: 0 0.5rem 0 0;
  }
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

  const [rgbColor, setRgbColor] = useState<Colour>({
    r: 0,
    g: 0,
    b: 0
  })

  const presetColors = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#417505', '#9013FE']

  const convRGBToHex = throttle((rgb: Colour) => {
    const componentToHex = (c: number) => {
      const hex = c.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    }

    const hexVal = '#' + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
    setHexColor(hexVal)
  }, 100)

  const convHexToRGB = throttle((hex: string) => {
    if (hex.length < 7) return

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) || ['0', '0', '0']
    setRgbColor({
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    })
  }, 100)

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
        <CurrentColor onClick={() => copyToClipboard(hexColor)}>{hexColor}</CurrentColor>
        <Form>
          <Input
            name="red"
            type="text"
            value={rgbColor.r}
            onChange={(e) => {
              e.preventDefault()
              setRgbColor({ ...rgbColor, r: parseInt(e.target.value) })
              convRGBToHex({ ...rgbColor, r: parseInt(e.target.value) })
            }}
          />
          <Input
            name="green"
            type="text"
            placeholder="Green Value"
            value={rgbColor.g}
            onChange={(e) => {
              e.preventDefault()
              setRgbColor({ ...rgbColor, g: parseInt(e.target.value) })
              convRGBToHex({ ...rgbColor, g: parseInt(e.target.value) })
            }}
          />
          <Input
            name="blue"
            type="text"
            placeholder="Blue Value"
            value={rgbColor.b}
            onChange={(e) => {
              e.preventDefault()
              setRgbColor({ ...rgbColor, b: parseInt(e.target.value) })
              convRGBToHex({ ...rgbColor, b: parseInt(e.target.value) })
            }}
          />

          <Input
            name="hex"
            type="text"
            placeholder="Hex Value"
            value={hexColor}
            onChange={(e) => {
              e.preventDefault()
              setHexColor(e.target.value)
              convHexToRGB(e.target.value)
            }}
          />
        </Form>
      </Wrapper>

      <Toaster position="bottom-center" />
    </Container>
  )
}
