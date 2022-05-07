import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { snippetStoreConstructor, SnippetStoreState } from '@mexit/core'

export const useSnippetStore = create<SnippetStoreState>(devtools(snippetStoreConstructor))
