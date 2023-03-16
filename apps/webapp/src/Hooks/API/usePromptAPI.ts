import { API, mog, PromptDataType, usePromptStore } from '@mexit/core'

import { updateDoc } from '../../Workers/controller'

export const usePromptAPI = () => {
  const setUserPromptAuthInfo = usePromptStore((s) => s.setUserPromptAuthInfo)
  const setPromptProviders = usePromptStore((s) => s.setPromptProviders)
  const setPrompts = usePromptStore((s) => s.setAllPrompts)

  const getPromptProviders = async () => {
    const res = await API.prompt.getAllPromptProviders()
    if (res) setPromptProviders(res)
  }

  const getAllPrompts = async () => {
    const promptsData = (await API.prompt.getAllPrompts()) as Record<string, Array<PromptDataType>>
    if (promptsData) {
      setPrompts(promptsData)
      Object.values(promptsData).forEach((prompts) =>
        prompts.forEach((prompt) =>
          updateDoc(
            'prompt',
            prompt.entityId,
            [{ type: 'p', id: 'PROMPT', children: [{ text: prompt.description }] }],
            prompt.title
          ).then((s) => mog(`${prompt.title} doc updated!`))
        )
      )
    }
  }

  const getUserPromptAuth = async () => {
    const promptAuth = await API.prompt.getUserPromptsAuth()
    if (promptAuth) setUserPromptAuthInfo(promptAuth)
  }

  return {
    getPromptProviders,
    getUserPromptAuth,
    getAllPrompts
  }
}
