import { Document } from 'flexsearch'

// Any indexable entity will have atleast a id and text filed. Additional fields to be added for tags etc
export interface GenericSearchData {
  id: string
  nodeUID?: string
  title?: string
  text: string
}

// Search results return the entire doc that matched and an additional matchField which is the name of the column in which a match was found
export interface GenericSearchResult {
  id: string
  title?: string
  text?: string
  matchField?: string[]
}

// prettier-ignore
export interface SearchIndex {
    node:    Document<GenericSearchData> | null
    snippet: Document<GenericSearchData> | null
    archive: Document<GenericSearchData> | null
  }
