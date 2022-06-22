/*
- Date
- Node level
- Tag based
- Show only relevant options - Filter options that are empty
- Sorting [:?]
*/

export type FilterKey = 'note' | 'tag' | 'date' | 'state' | 'has'
export interface SearchFilter<Item> {
  key: FilterKey
  id: string
  label: string
  filter: (item: Item) => boolean | number
  icon?: string
  // No. of items that match this filter
  count?: number
  // sort: 'asc' | 'desc'
}
