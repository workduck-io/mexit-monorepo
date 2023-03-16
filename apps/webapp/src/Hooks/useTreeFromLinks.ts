import { uniqBy } from 'lodash'

import { getAllParentIds, ILink, sanatizeLinks, useTreeStore } from '@mexit/core'

import { generateTree } from '../Utils/tree'

export const getTreeFromLinks = (links: ILink[]) => {
  const expanded = useTreeStore.getState().expanded
  // mog('Expanded', { expanded })

  const sanatizedLinks = sanatizeLinks(links)
  const tree = generateTree(sanatizedLinks, expanded)

  return tree
}

/**
 * returns tree data and also the matched items in flat order of occurrence
 */
export const getPartialTreeFromLinks = (matchedLinks: ILink[], allLinks: ILink[]) => {
  // Contains duplicates
  const dirtyTreeFlatItems = matchedLinks.reduce((p, c) => {
    const parents = getAllParentIds(c.path)
      .filter((par) => par !== undefined)
      .map((par) => allLinks.find((l) => l.path === par))
      .filter((l) => l !== undefined)
      .map((l) => ({
        id: l.path,
        nodeid: l.nodeid,
        icon: l.icon,
        stub: l.path !== c.path
      }))
    return [...p, ...parents]
  }, [])

  const treeFlatItems = uniqBy(dirtyTreeFlatItems, 'id')

  const allExpanded = treeFlatItems.map((l) => l.id)

  const tree = generateTree(
    treeFlatItems,
    allExpanded,
    // No need to sort as already ordered by search
    (a, b) => {
      return 0
    }
  )

  const matchedFlatItems = Object.keys(tree.items)
    .sort()
    .filter((i) => tree.items[i].data.stub === false)
    .map((i) => tree.items[i])

  // mog('Made the partialTree From Links', { matchedLinks, allLinks, tree, treeFlatItems })

  return { tree, matchedFlatItems }
}
