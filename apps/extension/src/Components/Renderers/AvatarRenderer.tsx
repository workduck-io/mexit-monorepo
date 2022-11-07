import React from 'react'

import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { mog } from '@mexit/core'

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
  const DownloadAvatar = () => {
    chrome.runtime.sendMessage(
      {
        type: 'DOWNLOAD_AVATAR',
        data: {
          url: screenshot
        }
      },
      (response) => {
        const { message, error } = response
        if (error) {
          mog('Avatar Download error', { error })
        } else {
          mog('Avatar Downloaded')
        }
      }
    )
  }

  return (
    <Container>
      <Button onClick={DownloadAvatar}>
        <Icon icon="pepicons:arrow-down" />
        Download Avatar
      </Button>
      <img src={screenshot} />
      <Button onClick={randomizeAvatar}>
        <Icon icon="pepicons:reload" />
        Randomize Avatar
      </Button>
    </Container>
  )
}

export default AvatarRenderer
