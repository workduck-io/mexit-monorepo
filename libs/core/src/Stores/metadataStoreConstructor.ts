import { MetaDataStoreType } from '../Types/Metadata'

const getInitialMetadata = () => ({
  notes: {},
  snippets: {},
  namespaces: {}
})

export const metadataStoreConstructor = (set, get): MetaDataStoreType => ({
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
