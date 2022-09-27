import { ILink, NodeLink } from '@mexit/core'

export const doesLinkRemain = (nodeid: string, refactored: ILink[]): boolean => {
  return refactored.map((r) => r.nodeid).indexOf(nodeid) !== -1
}

export const linkInRefactor = (id: string, refactored: NodeLink[]): false | NodeLink => {
  const index = refactored.map((r) => r.from).indexOf(id)
  if (index === -1) return false
  else return refactored[index]
}
