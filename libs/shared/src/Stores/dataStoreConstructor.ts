import {
  Settify,
  getUniquePath,
  generateNodeUID,
  mog,
  CachedILink,
  SEPARATOR,
  withoutContinuousDelimiter,
  removeLink,
  Tag,
  typeInvert
} from '@mexit/core'
import { nanoid } from 'nanoid'
import { getAllParentIds, getNodeIcon } from '../Utils/treeUtils'

export const generateTag = (item: string): Tag => ({
  id: nanoid(),
  text: item
})

export const dataStoreConstructor = (set, get) => ({
  tags: [],

  ilinks: [],

  linkCache: {},

  tagsCache: {},

  baseNodeId: '@',

  bookmarks: [],

  archive: [],

  publicNodes: {},

  initializeDataStore: (initData) => {
    // mog('Initializing Data store', { initData })
    set({
      ...initData
    })
  },

  addTag: (tag) => {
    const Tags = Settify([...get().tags.map((t) => t.value), tag])
    set({
      tags: Tags.map(generateTag)
    })
  },

  /*
   * Add a new ILink to the store
   * ## Rules
      - When new node / rename and clash
        - with existing add numeric suffix
        - not allowed with reserved keywords
   */
  addILink: ({ ilink, nodeid, parentId, archived, showAlert }) => {
    const { key, isChild } = withoutContinuousDelimiter(ilink)

    if (key) {
      ilink = isChild && parentId ? `${parentId}${key}` : key
    }

    const ilinks = get().ilinks

    const linksStrings = ilinks.map((l) => l.path)
    const reservedOrUnique = getUniquePath(ilink, linksStrings, showAlert)

    if (!reservedOrUnique) {
      throw Error(`ERROR-RESERVED: PATH (${ilink}) IS RESERVED. YOU DUMB`)
    }

    const uniquePath = reservedOrUnique.unique

    const parents = getAllParentIds(uniquePath) // includes link of child
    const newLinks = parents.filter((l) => !linksStrings.includes(l)) // only create links for non existing

    const newILinks = newLinks.map((l) => ({
      nodeid: nodeid && l === uniquePath ? nodeid : generateNodeUID(),
      path: l,
      icon: getNodeIcon(l)
    }))

    const newLink = newILinks.find((l) => l.path === uniquePath)

    const userILinks = archived ? ilinks.map((val) => (val.path === uniquePath ? { ...val, nodeid } : val)) : ilinks

    // mog('Adding ILink', { ilink, uniquePath, nodeid, parentId, archived, newLink, newLinks, userILinks, parents })
    set({
      ilinks: [...userILinks, ...newILinks]
    })

    if (newLink) return newLink
    return
  },

  setIlinks: (ilinks) => {
    // mog('Setting ILinks', { ilinks })
    set({
      ilinks
    })
  },

  removeBookamarks: (bookmarks) => {
    const ubookmarks = new Set(get().bookmarks.filter((b) => !(bookmarks.indexOf(b) > -1)))
    set({ bookmarks: Array.from(ubookmarks) })
  },

  setBookmarks: (bookmarks) => {
    const ubookmarks = new Set(bookmarks)
    set({ bookmarks: Array.from(ubookmarks) })
  },
  getBookmarks: () => get().bookmarks,

  setBaseNodeId: (baseNodeId) => set({ baseNodeId }),

  /*
   * Adds InternalLink between two nodes
   * Should not add duplicate links
   */
  addInternalLink: (ilink, nodeid) => {
    mog('Creating links', { ilink, nodeid })
    // No self links will be added
    if (nodeid === ilink.nodeid) return

    let nodeLinks = get().linkCache[nodeid]
    let secondNodeLinks = get().linkCache[ilink.nodeid]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    // Add internallink if not already present
    const isInNode = nodeLinks.filter((n) => n.nodeid === ilink.nodeid && n.type === ilink.type).length > 0
    if (!isInNode) nodeLinks.push(ilink)

    // Add internallink if not already present
    const isInSecondNode =
      secondNodeLinks.filter((n) => n.nodeid === nodeid && n.type === typeInvert(ilink.type)).length > 0
    if (!isInSecondNode) {
      secondNodeLinks.push({
        type: typeInvert(ilink.type),
        nodeid: nodeid
      })
    }

    set({
      linkCache: {
        ...get().linkCache,
        [nodeid]: nodeLinks,
        [ilink.nodeid]: secondNodeLinks
      }
    })
  },

  removeInternalLink: (ilink, nodeid) => {
    let nodeLinks = get().linkCache[nodeid]
    let secondNodeLinks = get().linkCache[ilink.nodeid]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    nodeLinks = removeLink(ilink, nodeLinks)
    const secondLinkToDelete: CachedILink = {
      type: ilink.type === 'from' ? 'to' : 'from',
      nodeid: nodeid
    }
    secondNodeLinks = removeLink(secondLinkToDelete, secondNodeLinks)

    set({
      linkCache: {
        ...get().linkCache,
        [nodeid]: nodeLinks,
        [ilink.nodeid]: secondNodeLinks
      }
    })
  },

  updateTagCache: (tag, nodes) => {
    const tagsCache = get().tagsCache
    if (tagsCache[tag]) delete tagsCache[tag]
    tagsCache[tag] = { nodes }
    set({ tagsCache })
  },

  updateTagsCache: (tagsCache) => {
    set({ tagsCache })
  },

  addBookmarks: (bookmarks) => {
    const ubookmarks = new Set([...get().bookmarks, ...bookmarks])
    set({ bookmarks: Array.from(ubookmarks) })
  },

  updateInternalLinks: (linkCache) => set({ linkCache }),

  updateInternalLinksForNode: (links, nodeid) => {
    set({
      linkCache: {
        ...get().linkCache,
        [nodeid]: links
      }
    })
  },

  addInArchive: (archive) => {
    const userArchive = [...get().archive, ...archive]
    set({ archive: userArchive })
  },

  removeFromArchive: (removeArchive) => {
    const userArchive = get().archive.filter((b) => !(removeArchive.map((i) => i.path).indexOf(b.path) > -1))
    set({ archive: userArchive })
  },

  unArchive: (archive) => {
    const userArchive = get().archive
    const afterUnArchive = userArchive.filter((ar) => ar.path !== archive.path)

    set({ archive: afterUnArchive })
  },

  setArchive: (archive) => {
    const userArchive = archive
    set({ archive: userArchive })
  },

  setNodePublic: (nodeId, publicURL) => {
    if (get().publicNodes[nodeId]) return
    set({ publicNodes: { ...get().publicNodes, [nodeId]: publicURL } })
  },
  setNodePrivate: (nodeId) => {
    if (get().publicNodes[nodeId]) {
      const newNodes = get().publicNodes
      delete newNodes[nodeId]
      set({ publicNodes: newNodes })
    }
  },
  checkNodePublic: (nodeId) => {
    return get().publicNodes?.[nodeId]
  }
})

export const getLevel = (path: string) => path.split(SEPARATOR).length

/** Link sanatization
 *
 * Orders the links according to their level in tree
 * Guarantees parent is before child -> Condition required for correct tree
 */

type treeMap = { id: string; nodeid: string; icon?: string }[]

export const sanatizeLinks = (links: treeMap): treeMap => {
  let oldLinks = links
  const newLinks: treeMap = []
  let currentDepth = 1

  while (oldLinks.length > 0) {
    for (const l of links) {
      if (getLevel(l.id) === currentDepth) {
        newLinks.push(l)
        oldLinks = oldLinks.filter((k) => k !== l)
      }
    }
    currentDepth += 1
  }

  return newLinks
}
