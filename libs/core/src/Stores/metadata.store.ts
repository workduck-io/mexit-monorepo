import { MetaDataStoreType } from '../Types/Metadata'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const getInitialMetadata = () => ({
  notes: {},
  snippets: {},
  namespaces: {}
})

const metadataStoreConfig = (set, get): MetaDataStoreType => ({
  metadata: getInitialMetadata(),
  initMetadata: (metadata) => set({ metadata }),
  addMetadata: (field, record) => {
    const existingMetadata = get().metadata
    set({ metadata: { ...existingMetadata, [field]: { ...existingMetadata[field], ...record } } })
  },
  updateMetadata: (field, key, value) => {
    const existingMetadata = get().metadata
    set({
      metadata: {
        ...existingMetadata,
        [field]: { ...existingMetadata[field], [key]: { ...existingMetadata[field][key], ...value } }
      }
    })
  },
  deleteMetadata: (field, key) => {
    const existingMetadata = get().metadata
    const { [key]: data, ...rest } = existingMetadata[field]
    set({ metadata: { ...existingMetadata, [field]: rest } })
  },
  reset: () => {
    set({ metadata: getInitialMetadata() })
  }
})

export const useMetadataStore = createStore(metadataStoreConfig, StoreIdentifier.METADATA, true)
