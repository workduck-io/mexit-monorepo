import create from 'zustand'
import { persist } from 'zustand/middleware'

import { promptStoreConstructor, PromptStoreType } from '@mexit/core'

export const usePromptStore = create<PromptStoreType>(
  persist(promptStoreConstructor, {
    name: 'prompt-store'
  })
)
