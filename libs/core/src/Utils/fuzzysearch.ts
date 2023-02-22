import { search } from 'fast-fuzzy'

type FuzzySearchable = string | object

export const fuzzySearch = <T extends FuzzySearchable>(
  list: Array<T>,
  text: string,
  keySelector = (item: T): FuzzySearchable => item
) => {
  const results = search<T, any>(text, list, { keySelector: keySelector })
  return results
}
