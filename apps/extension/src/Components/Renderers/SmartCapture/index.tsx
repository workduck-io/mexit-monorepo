import React from 'react'

import { useSputlitStore } from '../../../Stores/useSputlitStore'
import Form from '../../Form'
import SourceHeader from './SourceHeader'
import styled from 'styled-components'

const SmartCaptureContainer = styled.section`
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.medium};
  box-sizing: border-box;
`

const SmartCapture = () => {
  const data = useSputlitStore((store) => store.smartCaptureFormData)

  if (!data) return

  return (
    <SmartCaptureContainer>
      <SourceHeader title={`${data.page} Profile`} source={data.source} />
      <Form page={data.page} config={data.data} />
    </SmartCaptureContainer>
  )
}

export default SmartCapture
