import React from 'react'

import styled, { useTheme } from 'styled-components'

import { Button, MexIcon } from '@workduck-io/mex-components'

import { mog } from '@mexit/core'
import { copyTextToClipboard } from '@mexit/shared'

import { useSputlitStore } from '../../Stores/useSputlitStore'
import { generateAvatar } from '../../Utils/generateAvatar'

import { Controls } from './Screenshot/Screenshot.style'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.large};
  margin: ${({ theme }) => theme.spacing.medium} 0;
  justify-content: center;
`

const AvatarImage = styled.img`
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: inset 1rem 1.25rem 1.25rem 1.25rem ${({ theme }) => theme.colors.form.button.bg};
`

const AvatarRenderer = () => {
  const theme = useTheme()
  const { screenshot, setScreenshot , avatarSeed , setAvatarSeed} = useSputlitStore()

  const randomizeAvatar = () => {
    const imgData = generateAvatar()
    setScreenshot(imgData.svg)
    setAvatarSeed(imgData.seed)
  }
  const downloadAvatar = () => {
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
  
  const copyAvatarURL = () => {
    copyTextToClipboard(`https://avatars.dicebear.com/api/male/${avatarSeed}.svg`)
  }

  return (
    <Container>
      <AvatarImage src={screenshot} />
      <Controls>
        <Button onClick={randomizeAvatar}>
          <MexIcon noHover icon="pepicons:reload" color={theme.colors.primary} />
          Randomize
        </Button>
        <Button onClick={copyAvatarURL}>
          <MexIcon noHover icon="pepicons:clipboard" color={theme.colors.primary} />
          Copy URL
        </Button>
        <Button onClick={downloadAvatar}>
          <MexIcon noHover icon="pepicons:arrow-down" color={theme.colors.primary} />
          Download
        </Button>
      </Controls>
    </Container>
  )
}

export default AvatarRenderer
