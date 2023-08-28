import {
  CachedILink,
  convertContentToRawText,
  defaultContent,
  getLinksFromContent,
  getNameFromPath,
  HASH_SEPARATOR,
  hasLink,
  ILink,
  mog,
  NodeLink,
  SEPARATOR,
  TodoStatus,
  useContentStore,
  useDataStore,
  useReminderStore,
  useSnippetStore,
  useTodoStore
} from '@mexit/core'

import { useNodes } from './useNodes'

export const getTitleFromPath = (path: string, withNoteId = false) => {
  const separator = withNoteId ? HASH_SEPARATOR : SEPARATOR
  const titleAt = withNoteId ? -2 : -1

  return path?.split(separator)?.slice(titleAt)[0]
}

export const useLinks = () => {
  const contents = useContentStore((state) => state.contents)
  const addInternalLink = useDataStore((state) => state.addInternalLink)
  const removeInternalLink = useDataStore((state) => state.removeInternalLink)
  const linkCache = useDataStore((state) => state.linkCache)
  const setILinks = useDataStore((store) => store.setIlinks)
  const { isInArchive } = useNodes()

  const getAllLinks = () => {
    // We assume that all links exist
    const allLinks: NodeLink[] = []
    Object.keys(contents).forEach((key) => {
      const { content } = contents[key]
      const links = getLinksFromContent(content)
      if (links.length > 0) {
        links.forEach((to) => {
          allLinks.push({
            from: key,
            to
          })
        })
      }
    })

    return allLinks
  }

  const getLinkCount = (): {
    notes: number
    archive: number
    reminders: number
    snippets: number
    tasks: number
  } => {
    const links = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive
    const remindersAll = useReminderStore.getState().reminders
    const snippets = useSnippetStore.getState().snippets ?? {}
    const ntasks = useTodoStore.getState().todos

    const reminders = remindersAll.filter((r) => r.state.done === false)

    const tasksC = Object.entries(ntasks).reduce((acc, [_k, v]) => {
      const c = v.reduce((acc, t) => {
        // TODO: Find a faster way to check for empty content
        const text = convertContentToRawText(t.content).trim()
        // mog('empty todo check', { text, nodeid, todo })
        if (text === '') {
          return acc
        }
        if (t.content === defaultContent.content) return acc
        if (t.properties.status !== TodoStatus.completed) {
          acc += 1
        }
        return acc
      }, 0)
      return acc + c
    }, 0)

    // mog('reminderCounds', { remindersAll, reminders })

    return {
      notes: links.length,
      archive: archive.length,
      reminders: reminders.length,
      snippets: Object.values(snippets).length,
      tasks: tasksC
    }
  }

  const getTitleFromNoteId = (noteId: string, options?: { includeShared?: boolean; includeArchived?: boolean }) => {
    const path = getPathFromNodeid(noteId, true, options?.includeArchived)

    return getTitleFromPath(path)
  }

  const getLinks = (nodeid: string): NodeLink[] => {
    const links = linkCache[nodeid]
    if (links) {
      return links.map((l) => {
        return {
          [l.type]: l.nodeid,
          [l.type === 'from' ? 'to' : 'from']: nodeid
        } as unknown as NodeLink
      })
    }
    return []
  }

  /**
   * Creates a new internal link
   * The link should be unique between two nodes
   * No self links are allowed
   * Returns true if the link is created or false otherwise
   * */
  const createLink = (nodeid: string, nodeLink: NodeLink): boolean => {
    if (nodeLink.to === nodeLink.from) return false

    let nodeLinks = useDataStore.getState().linkCache[nodeid]
    let secondNodeLinks = useDataStore.getState().linkCache[nodeLink.to]

    if (!nodeLinks) nodeLinks = []
    if (!secondNodeLinks) secondNodeLinks = []

    nodeLinks.push({ type: 'from', nodeid: '' })
    secondNodeLinks.push({
      type: 'to',
      nodeid: nodeid
    })

    return true
  }

  const getBacklinks = (nodeid: string) => {
    const links = linkCache[nodeid]
    if (links) {
      return links.filter((l) => l.type === 'from' && !isInArchive(l.nodeid) && getPathFromNodeid(l.nodeid))
    }
    return []
  }

  const getForwardlinks = (nodeid: string): CachedILink[] => {
    const links = Object.entries(linkCache).reduce((p, [linknodeid, l]: [linknodeid: string, l: any]) => {
      const matchedLinks = l.filter((l) => l.type === 'from' && l.nodeid === nodeid)

      return matchedLinks.length > 0 ? [...p, { nodeid: linknodeid, type: 'to' as const }] : p
    }, [] as CachedILink[])
    return links
  }

  const updateLinksFromContent = (nodeid: string, content: any[]) => {
    if (content) {
      const links: CachedILink[] = getLinksFromContent(content).map((l) => ({
        type: 'to',
        nodeid: l
      }))

      let currentLinks = linkCache[nodeid]
      if (!currentLinks) currentLinks = []

      const currentToLinks = currentLinks.filter((l) => l.type === 'to')

      const toLinkstoDelete = currentToLinks.filter((l) => {
        return !hasLink(l, links)
      })

      const toLinkstoAdd = links.filter((l) => {
        return !hasLink(l, currentLinks)
      })

      toLinkstoDelete.forEach((l) => removeInternalLink(l, nodeid))
      toLinkstoAdd.forEach((l) => addInternalLink(l, nodeid))
    }
  }

  const getILinkFromNodeid = (noteId: string, shared?: boolean, archived?: boolean) => {
    const links = useDataStore.getState().ilinks
    const link = links.find((l) => l.nodeid === noteId)
    if (link) return link

    if (archived) {
      const archiveNoteLinks = useDataStore.getState().archive
      const noteLink = archiveNoteLinks?.find((l) => l.nodeid === noteId)
      return noteLink
    }

    if (shared) {
      const sharedLinks = useDataStore.getState().sharedNodes
      const sharedLink = sharedLinks?.find((l) => l.nodeid === noteId)
      if (sharedLink) return sharedLink
    }
  }

  const getNodeidFromPath = (path: string, namespace: string) => {
    const links = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive
    const sharedNodes = useDataStore.getState().sharedNodes

    const link = links.find((l) => l.namespace === namespace && l.path === path)
    if (link) return link.nodeid

    const archivedLink = archive.find((l) => l.namespace === namespace && l.path === path)
    if (archivedLink) return archivedLink.nodeid

    const sharedNode = sharedNodes.find((l) => l.namespace === namespace && l.path === path)
    if (sharedNode) return sharedNode.nodeid
  }

  const updateILinks = (addedILinks: Array<ILink>, removedILinks: Array<ILink>) => {
    let links = useDataStore.getState().ilinks

    const intersection = removedILinks.filter((l) => addedILinks.find((rem) => l.nodeid === rem.nodeid))

    intersection.forEach((ilink) => {
      links.splice(
        links.findIndex((item) => item.nodeid === ilink.nodeid),
        1
      )
    })

    mog('After intersection', { links, intersection })
    addedILinks.forEach((p) => {
      const idx = links.find((link) => link.nodeid === p.nodeid)

      if (idx && idx.path !== p.path)
        links = links.map((link) => (link.nodeid === p.nodeid ? { ...link, path: p.path } : link))
      else if (idx === undefined) links.push({ ...p, createdAt: Infinity })
    })

    const newILinks = [...links]

    setILinks(newILinks)

    return newILinks
  }

  const getPathFromShared = (nodeid: string) => {
    const links = useDataStore.getState().sharedNodes

    const link = links.find((l) => l.nodeid === nodeid)
    if (link) return link.path
  }

  const getParentILink = (path: string, namespace?: string) => {
    const links = useDataStore.getState().ilinks
    const parentPath = path.split(SEPARATOR).slice(0, -1).join(SEPARATOR)

    const namespaceILinks = !namespace ? links : links.filter((l) => l.namespace === namespace)
    const note = namespaceILinks.find((ilink) => ilink.path === parentPath)

    // mog('getParentILink', { path, parentPath, note, namespaceILinks })

    return note
  }

  const getPathFromNodeid = (nodeid: string, includeShared = false, includeArchived = false) => {
    const links = useDataStore.getState().ilinks

    const link = links.find((l) => l.nodeid === nodeid)
    if (link) return link.path

    if (includeArchived) {
      const archive = useDataStore.getState().archive
      const archivedLink = archive.find((l) => l.nodeid === nodeid)
      if (archivedLink) return archivedLink.path
    }

    if (includeShared) {
      const shared = useDataStore.getState().sharedNodes
      const sharedLink = shared.find((l) => l.nodeid === nodeid)
      if (sharedLink) return sharedLink.path
    }
  }

  const getNodeTitleSave = (nodeid: string) => {
    const pathFromNodeid = getPathFromNodeid(nodeid)
    if (pathFromNodeid) return getNameFromPath(pathFromNodeid)

    const pathFromShared = getPathFromShared(nodeid)
    if (pathFromShared) return getNameFromPath(pathFromShared)
  }

  return {
    getAllLinks,
    getLinkCount,
    getLinks,
    getBacklinks,
    updateLinksFromContent,
    getNodeidFromPath,
    getILinkFromNodeid,
    getNodeTitleSave,
    getPathFromShared,
    getPathFromNodeid,
    createLink,
    updateILinks,
    getTitleFromNoteId,
    getParentILink,
    getForwardlinks
  }
}

export const getNodeidFromPathAndLinks = (links: ILink[], path: string, namespace: string) => {
  const link = links.find((l) => l.namespace === namespace && l.path === path)
  if (link) return link.nodeid
}

export const getLinkFromNodeIdHookless = (nodeid: string) => {
  const links = useDataStore.getState().ilinks
  const archive = useDataStore.getState().archive

  const link = links.find((l) => l.nodeid === nodeid)
  if (link) return link

  const archivedLink = archive.find((l) => l.nodeid === nodeid)
  if (archivedLink) return archivedLink
}

export const getPathFromNodeIdHookless = (nodeid: string) => {
  const links = useDataStore.getState().ilinks
  const archive = useDataStore.getState().archive

  const link = links.find((l) => l.nodeid === nodeid)
  if (link) return link.path

  const archivedLink = archive.find((l) => l.nodeid === nodeid)
  if (archivedLink) return archivedLink.path
}
