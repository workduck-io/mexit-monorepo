/*
- Date
- Node level
- Tag based
- Show only relevant options - Filter options that are empty
- Sorting [:?]
*/
import { MIcon } from './Store'

export type FilterKey = 'note' | 'tag' | 'date' | 'state' | 'has' | 'mention' | 'space' | 'domain'

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

export const FilterTypeArray = [
  'note', // Does item belong to note
  'tag', // Does item have tag
  'date', // Does item have date TODO: Use updated and created will need before after and range
  'state', // Does item have a specific

  'status', // Does item have a specific status (Task specific)
  'priority', // Does item have a specific priority (Task specific)

  // TODO: Determine whether it will be a single select or not
  'has', // Does item have a specific data property
  // For reminders, has is used to determine if the reminder has a todo attached

  'mention', // Does item mention a specific user
  'space', // Does item belong to a specific space

  'domain' // Does item (mostly a URL) belong to a specific domain
] as const

// Produces a union type of the values of FilterTypeArray
export type FilterType = (typeof FilterTypeArray)[number]

export const FilterJoinArray = [
  'all', // All values should match
  'any', // Any value should match
  'notAny', // Any value should not match (if any one matches, item dropped)
  'none' // None of the values should match (if some match, item passed, if all match item dropped)
] as const

// How to join the values of a single filter
export type FilterJoin = (typeof FilterJoinArray)[number]

export const SortOrderArray = ['ascending', 'descending'] as const
export type SortOrder = (typeof SortOrderArray)[number]

export type SortType = string

/** Filter join example
 *
 * For items A, B, C, D
 * which match with f1, f2 applied as:
 *
 * A - f1
 * B - f1 f2
 * C - f2
 * D - none
 *
 * All B - f1 && f2
 * Any A, B, C - f1 || f2
 * notAny D - !(f1 || f2)
 * none A, C, D - !(f1 && f2)
 *
 */

// How to join the all individual filters together (not the values)
export type GlobalFilterJoin =
  | 'all' // All filters should match
  | 'any' // Any filter should match

export interface FilterValue {
  /** Unique id of filter value */
  id: string

  label: string

  /** Value of the filter, usually the id for the type of the filter */
  value: string

  /** The number of items that match this value */
  count?: number
}

export interface Filter {
  /** Unique id for the filter */
  id: string

  /** The type of the filter */
  type: FilterType

  /** How to join this filters values */
  join: FilterJoin

  /** Whether there can be multiple values selected */
  multiple: boolean

  /**
   * The values of the filter
   * No values in both multi and single are represented by empty array
   */
  values: FilterValue[]
}

export interface FilterTypeWithOptions {
  type: FilterType
  label: string
  options: FilterValue[]
}

export type Filters = Array<FilterTypeWithOptions>

export type FilterFunction = (item: any, filter: Filter) => boolean | number

export type SearchFilterFunctions = Partial<{
  [key in FilterType]: FilterFunction
}>
