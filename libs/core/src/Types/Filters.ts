/*
- Date
- Node level
- Tag based
- Show only relevant options - Filter options that are empty
- Sorting [:?]
*/

export type FilterKey = 'note' | 'tag' | 'date' | 'state' | 'has' | 'mention'

export interface SearchFilter<Item> {
  key: FilterKey
  id: string
  label: string
  // Value to filter with
  value: string
  // filter: (item: Item) => boolean | number -> Replaced by FilterFunctions
  icon?: string
  // No. of items that match this filter
  count?: number
  // sort: 'asc' | 'desc'
}
