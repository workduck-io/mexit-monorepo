import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { tinykeys } from '@workduck-io/tinykeys'

import { capitalize } from '@mexit/core'
import { DefaultMIcons, FlexBetween, GroupHeader, IconDisplay, ServiceDescription, Title } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { usePromptStore } from '../../Stores/usePromptStore'

import { IconContainer, PromptContainer } from './styled'

const PromptPage = () => {
  const params = useParams()
  const promptId = params.promptId
  const getPrompt = usePromptStore((s) => s.getPrompt)

  const prompt = useMemo(() => {
    return getPrompt(promptId)
  }, [promptId])

  const { goTo } = useRouting()

  const returnToSnippets = () => goTo(ROUTE_PATHS.snippets, NavigationType.push)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        returnToSnippets()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <PromptContainer onBackRoute={ROUTE_PATHS.snippets}>
      <div>
        <IconContainer>
          <span>
            <IconDisplay icon={DefaultMIcons.PROMPT} size={56} />
          </span>
        </IconContainer>
        <GroupHeader>
          <FlexBetween>
            <Title>{prompt.title}</Title>
          </FlexBetween>
          <ServiceDescription>
            {capitalize(prompt?.description ?? '') ??
              `Magna quis cupidatat laboris aliquip esse. Ut Despacito eu voluptate qui incididunt ipsum. Officia et esse
              enim laborum ullamco magna labore quis sit mollit. Esse amet nostrud pariatur esse. Commodo consequat
              ipsum tempor ad cillum ad et esse nostrud veniam pariatur excepteur laboris. Adipisicing aliqua do
              proident aliquip ad et voluptate et ut excepteur mollit do tempor. Magna nostrud esse sunt anim quis in.
              Amet ut fugiat adipisicing officia aliquip quis non. Veniam magna dolor consequat quis aliqua ea ipsum
              reprehenderit commodo commodo. Minim minim sit sit magna labore sint esse ipsum.`}
          </ServiceDescription>
        </GroupHeader>
      </div>
    </PromptContainer>
  )
}

export default PromptPage
