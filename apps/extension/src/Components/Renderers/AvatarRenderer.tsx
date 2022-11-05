import React from 'react'

import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { useSputlitStore } from '../../Stores/useSputlitStore'
import { generateAvatar } from '../../Utils/generateAvatar'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const AvatarRenderer = () => {
  const { screenshot, setScreenshot } = useSputlitStore()

  const randomizeAvatar = () => {
    const imgData = generateAvatar()

    setScreenshot(imgData)
  }

  return (
    <Container>
      <img src={screenshot} />
      <Button onClick={randomizeAvatar}>
        <Icon icon="pepicons:reload" />
        Randomize Avatar
      </Button>
    </Container>
  )
}

export default AvatarRenderer
