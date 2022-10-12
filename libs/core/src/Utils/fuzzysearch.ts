import { search } from 'fast-fuzzy'

export const fuzzySearch = (list: any[], text: string, keySelector = (item) => item) => {
  const results = search(text, list, { keySelector: keySelector })
  return results
}
