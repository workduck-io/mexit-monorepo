import { useMemo } from 'react'

import { PromptDataType } from '@mexit/core'

import { usePromptStore } from '../Stores/usePromptStore'

const usePrompts = () => {
  const prompts = usePromptStore((store) => store.prompts)

  const allPrompts: Array<PromptDataType> = useMemo(() => {
    return Object.values(prompts).reduce((prev, current) => {
      return [...prev, ...current]
    }, [])
  }, [prompts])

  return {
    allPrompts
  }
}

export default usePrompts
