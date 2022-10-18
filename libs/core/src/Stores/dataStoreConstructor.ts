import { produce } from 'immer'

import { defaultCommands } from '../Data/defaultCommands'
import { Tag, CachedILink, ILink } from '../Types/Editor'
import { DataStoreState } from '../Types/Store'
import { Settify, withoutContinuousDelimiter, typeInvert } from '../Utils/helpers'
import { generateNodeUID, SEPARATOR } from '../Utils/idGenerator'
import { removeLink } from '../Utils/links'
import { mog } from '../Utils/mog'
import { getAllParentIds, getUniquePath } from '../Utils/path'
import { getAllParentPaths, getNodeIcon } from '../Utils/treeUtils'

export const generateTag = (item: string): Tag => ({
  value: item
})

export const dataStoreConstructor = (set, get) => ({
  tags: [],
  ilinks: [],
  linkCache: {},
  tagsCache: {},
  baseNodeId: '__loading__',
  bookmarks: [],
  archive: [],
  publicNodes: [],
  sharedNodes: [],
  namespaces: [],
  slashCommands: { default: defaultCommands, internal: [] },

  initializeDataStore: (initData) => {
    // mog('Initializing Data store', { initData })
    set({
      ...initData
    })
  },

  resetDataStore: () => {
    set({
      tags: [],
      ilinks: [],
      linkCache: {},
      tagsCache: {},
      namespaces: [],
      bookmarks: [],
      archive: [],
      baseNodeId: '__loading__',
      slashCommands: {
        default: defaultCommands,
        internal: []
      }
    })
  },

  addNamespace: (namespace) => {
    set({ namespaces: [...get().namespaces, namespace] })
  },

  setNamespaces: (namespaces) => set({ namespaces }),

  updateNamespace: (namespace) => {
    set(() => {
      const namespaces = get().namespaces.map((ns) => {
        if (ns.id === namespace.id) {
          return namespace
        }
        return ns
      })
      return { namespaces }
    })
  },

  addTag: (tag) => {
    const currentTags = get().tags
    mog('currentTags', { currentTags, tag })

    const Tags = Settify([...currentTags.map((t) => t.value), tag])

    set({
      tags: Tags.map(generateTag)
    })
  },

  setTags: (tags) => {
    set({ tags })
  },

  /*
   * Add a new ILink to the store
   * ## Rules
      - When new node / rename and clash
        - with existing add numeric suffix
        - not allowed with reserved keywords
   */
  addILink: ({ ilink, namespace, nodeid, openedNotePath, archived, showAlert }) => {
    const uniquePath = get().checkValidILink({ notePath: ilink, openedNotePath, namespace, showAlert })
    // mog('Unique Path', { uniquePath })

    const ilinks = get().ilinks
    const linksStrings = ilinks.filter((l) => l.namespace === namespace).map((l) => l.path)

    const parents = getAllParentIds(uniquePath) // includes link of child
    const newLinks = parents.filter((l) => !linksStrings.includes(l)) // only create links for non existing

    const newILinks = newLinks.map((l) => ({
      nodeid: nodeid && l === uniquePath ? nodeid : generateNodeUID(),
      namespace,
      path: l,
      icon: getNodeIcon(l)
    }))

    const newLink = newILinks.find((l) => l.path === uniquePath && l.namespace === namespace)

    const userILinks = archived ? ilinks.map((val) => (val.path === uniquePath ? { ...val, nodeid } : val)) : ilinks
    const createdILinks = [...userILinks, ...newILinks]

    set({
      ilinks: createdILinks
    })

    if (newLink) return newLink

    return
  },

  checkValidILink: ({ notePath, openedNotePath, showAlert, namespace }) => {
    const { key, isChild } = withoutContinuousDelimiter(notePath)

    // * If `notePath` starts with '.', than create note under 'opened note'.
    if (key) {
      notePath = isChild && openedNotePath ? `${openedNotePath}${key}` : key
    }

    const iLinksOfNamespace = namespace ? get().ilinks.filter((link) => link.namespace === namespace) : get().ilinks
    // mog('ILINKS OF NOTE ARE', { iLinksOfNamespace, notePath, namespace })

    const linksStrings = iLinksOfNamespace.map((l) => l.path)
    const reservedOrUnique = getUniquePath(notePath, linksStrings, showAlert)

    if (!reservedOrUnique) {
      throw Error(`ERROR-RESERVED: PATH (${notePath}) IS RESERVED. YOU DUMB`)
    }

    return reservedOrUnique.unique
  },

  setIlinks: (ilinks) => {
    set(
      produce((draft) => {
        // eslint-disable-next-line
        // @ts-ignore
        draft.ilinks = ilinks
      })
    )
  },

  setSlashCommands: (slashCommands) => set({ slashCommands }),

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
    const prevArchive = get().archive
    const prevNodeids = prevArchive.map((a) => a.nodeid)
    const userArchive = [...prevArchive, ...archive.filter((a) => !prevNodeids.includes(a.nodeid))]
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

  setNodePublic: (nodeId) => {
    if (get().publicNodes.find((i) => i === nodeId)) return
    set({ publicNodes: [...get().publicNodes, nodeId] })
  },
  setNodePrivate: (nodeId) => {
    const filtered = get().publicNodes.filter((i) => i !== nodeId)
    set({ publicNodes: filtered })
  },
  checkNodePublic: (nodeId) => {
    return get().publicNodes.find((i) => i === nodeId) ? true : false
  },

  setSharedNodes: (sharedNodes) => {
    set({ sharedNodes })
  },

  getSharedNodes: () => get().sharedNodes,
  setPublicNodes: (publicNodes) => {
    set({
      publicNodes: publicNodes
    })
  },
  _hasHydrated: false,
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state
    })
  }
})

export const getLevel = (path: string) => path.split(SEPARATOR).length

/** Link sanatization
 *
 * Orders the links according to their level in tree
 * Guarantees parent is before child -> Condition required for correct tree
 */

type treeMap = { id: string; nodeid: string; icon?: string }[]

export interface FlatItem {
  id: string
  nodeid: string
  parentNodeId?: string
  tasks?: number
  reminders?: number
  // lastOpenedState?: LastOpenedState
  icon?: string
  stub?: boolean
  namespace: string
}

/** Link sanatization
 *
 * Orders the links according to their level in tree
 * Guarantees parent is before child -> Condition required for correct tree
 */
export const sanatizeLinks = (links: ILink[]): FlatItem[] => {
  let oldLinks = links
  const newLinks: FlatItem[] = []
  let currentDepth = 1

  while (oldLinks.length > 0) {
    for (const l of links) {
      if (getLevel(l.path) === currentDepth) {
        const ilink = { id: l.path, nodeid: l.nodeid, icon: l.icon, namespace: l.namespace }
        newLinks.push(l.parentNodeId ? { ...ilink, parentNodeId: l.parentNodeId } : ilink)
        oldLinks = oldLinks.filter((k) => k.nodeid !== l.nodeid)
      }
    }
    currentDepth += 1
  }

  return newLinks
}
