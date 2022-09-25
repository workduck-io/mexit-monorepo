/*
- Date
- Node level
- Tag based
- Show only relevant options - Filter options that are empty
- Sorting [:?]
*/
import { MIcon } from './Store'

export type FilterKey = 'note' | 'tag' | 'date' | 'state' | 'has' | 'mention' | 'space'

export interface SearchFilter<Item> {
  key: FilterKey
  id: string
  label: string
  // Value to filter with
  value: string
  // filter: (item: Item) => boolean | number -> Replaced by FilterFunctions
  icon?: MIcon
  // No. of items that match this filter
  count?: number
  // sort: 'asc' | 'desc'
}
