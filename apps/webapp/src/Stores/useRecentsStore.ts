import { recentsStoreConstructor, RecentsType } from '@mexit/core'

import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useRecentsStore = create<RecentsType>(persist(recentsStoreConstructor, { name: 'recents' }))
