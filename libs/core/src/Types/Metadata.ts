type NoteMetadata = any
type SnippetMetadata = any
type NamespaceMetadata = any

export interface MetaDataMapType {
  notes: Record<string, NoteMetadata>
  snippets: Record<string, SnippetMetadata>
  namespaces: Record<string, NamespaceMetadata>
}

export type SupportedFields = keyof MetaDataMapType

export interface MetaDataStoreType {
  metadata: MetaDataMapType
  addMetadata: <T extends SupportedFields>(field: T, record: MetaDataMapType[T]) => void
  updateMetadata: <T extends SupportedFields>(field: T, key: string, value: any) => void
  deleteMetadata: <T extends SupportedFields>(field: T, key: string) => void
  initMetadata: (metadata: MetaDataMapType) => void
  reset: () => void
}
