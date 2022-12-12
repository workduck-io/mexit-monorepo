import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { metadataStoreConstructor, MetaDataStoreType } from '@mexit/core'

export const useMetadataStore = create<MetaDataStoreType>(
  devtools(
    persist(metadataStoreConstructor, {
      name: 'mexit-metadata-store'
    }),
    { name: 'mexit-metadata-store' }
  )
)
