import { useMemo } from 'react'

import { PromptDataType, usePromptStore } from '@mexit/core'


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
