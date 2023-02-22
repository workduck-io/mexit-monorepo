import { type FullOptions, search } from 'fast-fuzzy'

type FuzzySearchable = string | object
type KeySelector<T extends FuzzySearchable> = (item: T) => string | string[]

export const fuzzySearch = <T extends FuzzySearchable>(list: Array<T>, text: string, keySelector?: KeySelector<T>) => {
  const results = search<T, FullOptions<T>>(text, list, { keySelector: keySelector, returnMatchData: false })
  return results
}
