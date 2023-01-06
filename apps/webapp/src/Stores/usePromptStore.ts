import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { promptStoreConstructor, PromptStoreType } from '@mexit/core'

export const usePromptStore = create<PromptStoreType>(
  devtools(
    persist(promptStoreConstructor, {
      name: 'web-prompt-store'
    }),
    { name: 'web-prompt-store' }
  )
)
