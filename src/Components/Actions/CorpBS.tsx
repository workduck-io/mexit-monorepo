import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin: 2rem;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 1.5rem !important;
    margin: 1rem 0;
  }
`

const Blockquote = styled.blockquote`
  font-size: 1.25rem !important;
  color: grey;
  text-align: center;
  border-left: 10px solid #50e3c2;
  padding: 1rem;

  &:empty {
    display: none;
  }
`

const CorporateBS = () => {
  const [corpBS, setCorpBS] = useState<string>()

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'GET_CORP_BS'
      },
      (resp) => {
        const { message, error } = resp
        if (!error) setCorpBS(message)
      }
    )
  }, [])

  return (
    <Container>
      <h1>Your Random Dose of Corporate BS is</h1>
      <Blockquote>{corpBS}</Blockquote>

      <p>
        Credits:{' '}
        <a href="https://github.com/sameerkumar18/corporate-bs-generator-api" rel="noopener noreferrer" target="_blank">
          https://github.com/sameerkumar18/corporate-bs-generator-api
        </a>
      </p>
    </Container>
  )
}

export default CorporateBS
