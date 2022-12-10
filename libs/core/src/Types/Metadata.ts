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
  deleteMetadata: <T extends SupportedFields>(field: T, key: string) => void
  reset: () => void
}
