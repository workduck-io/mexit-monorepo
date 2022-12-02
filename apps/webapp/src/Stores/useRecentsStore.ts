import create from 'zustand'
import { persist } from 'zustand/middleware'

import { recentsStoreConstructor, RecentsType } from '@mexit/core'

export const useRecentsStore = create<RecentsType>(persist(recentsStoreConstructor, { name: 'recents' }))
