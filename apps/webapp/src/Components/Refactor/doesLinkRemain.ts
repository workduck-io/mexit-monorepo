import { NodeLink } from '@mexit/core'

export const doesLinkRemain = (id: string, refactored: NodeLink[]): boolean => {
  return refactored.map((r) => r.from).indexOf(id) === -1
}

export const linkInRefactor = (id: string, refactored: NodeLink[]): false | NodeLink => {
  const index = refactored.map((r) => r.from).indexOf(id)
  if (index === -1) return false
  else return refactored[index]
}
