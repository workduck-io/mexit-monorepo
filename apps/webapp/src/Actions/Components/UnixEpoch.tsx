import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@mexit/shared'
import styled from 'styled-components'
import { copyToClipboard } from '@mexit/shared'
import { Toaster } from 'react-hot-toast'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem;

  h2 {
    font-size: 1.25rem !important;
  }
`

const Columns = styled.div`
  display: flex;
`

const Output = styled.div`
  cursor: pointer;
  margin: 1rem 0;
  padding: 0.5rem;
  background: #ccc;
  width: fit-content;
  border-radius: 5px; ;
`

export const UnixEpochConverter = () => {
  const [epochT, setEpochT] = useState(Math.round(new Date().getTime() / 1000))
  const [datetime, setDateTime] = useState(new Date().toLocaleString())

  const [epochInput, setEpochInput] = useState(epochT)
  const [dtInput, setDtInput] = useState(datetime)

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date()
      setEpochT(Math.round(date.getTime() / 1000))
      setDateTime(date.toLocaleString())
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  const datetimeInput = useRef(null)
  const utsInput = useRef(null)

  return (
    <Container>
      <h2>Unix Timestamp Conversion</h2>
      <p>Current Unix Timestamp is: {epochT}</p>
      <p>Current Date and Time is: {datetime}</p>
      <Columns>
        <div>
          <h3>To Unix Timestamp</h3>
          <Input
            type="datetime-local"
            ref={datetimeInput}
            value={epochInput}
            onChange={() => setEpochInput(datetimeInput.current.value)}
          />
          <Output onClick={() => copyToClipboard(Math.round(new Date(epochInput).getTime() / 1000))}>
            {Math.round(new Date(epochInput).getTime() / 1000)}
          </Output>
        </div>

        <div>
          <h3>From Unix Timestamp</h3>
          <Input
            type="number"
            min="0"
            max="2147483647"
            ref={utsInput}
            value={dtInput}
            onChange={() => setDtInput(utsInput.current.value)}
          />
          <Output onClick={() => copyToClipboard(new Date(parseInt(dtInput) * 1000).toLocaleString())}>
            {new Date(parseInt(dtInput) * 1000).toLocaleString()}
          </Output>
        </div>
      </Columns>
      <Toaster position="bottom-center" />
    </Container>
  )
}
