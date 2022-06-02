import {
  CachedILink,
  convertContentToRawText,
  defaultContent,
  getLinksFromContent,
  hasLink,
  ILink,
  NodeLink,
  TodoStatus
} from '@mexit/core'
import { useContentStore } from '@workduck-io/mex-editor'
import { useDataStore } from '../Stores/useDataStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useTodoStore } from '../Stores/useTodoStore'
import { useNodes } from './useNodes'

export const useLinks = () => {
  const contents = useContentStore((state) => state.contents)
  const addInternalLink = useDataStore((state) => state.addInternalLink)
  const removeInternalLink = useDataStore((state) => state.removeInternalLink)
  const linkCache = useDataStore((state) => state.linkCache)
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
    const snippets = useSnippetStore.getState().snippets
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
        if (t.metadata.status !== TodoStatus.completed) {
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
      snippets: snippets.length,
      tasks: tasksC
    }
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

    // console.log('Creating links', { nodeLink })
    // No self links will be added

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

  const updateLinksFromContent = (nodeid: string, content: any[]) => {
    // console.log('We are updating links from content', { nodeid, content, linkCache })

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

  const getILinkFromNodeid = (nodeid: string) => {
    const links = useDataStore.getState().ilinks
    const link = links.find((l) => l.nodeid === nodeid)
    if (link) return link
  }

  const getNodeidFromPath = (path: string) => {
    const links = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive

    const link = links.find((l) => l.path === path)
    const archivedLink = archive.find((l) => l.path === path)

    if (link) return link.nodeid
    if (archivedLink) return archivedLink.nodeid
  }

  const getPathFromNodeid = (nodeid: string) => {
    const links = useDataStore.getState().ilinks

    const link = links.find((l) => l.nodeid === nodeid)
    if (link) return link.path
  }

  return {
    getAllLinks,
    getLinkCount,
    getLinks,
    getBacklinks,
    updateLinksFromContent,
    getNodeidFromPath,
    getILinkFromNodeid,
    getPathFromNodeid,
    createLink
  }
}

export const getNodeidFromPathAndLinks = (links: ILink[], path: string) => {
  const link = links.find((l) => l.path === path)
  if (link) return link.nodeid
}

export const getPathFromNodeIdHookless = (nodeid: string) => {
  const links = useDataStore.getState().ilinks
  const archive = useDataStore.getState().archive

  const link = links.find((l) => l.nodeid === nodeid)
  const archivedLink = archive.find((l) => l.nodeid === nodeid)

  if (link) return link.path
  if (archivedLink) return archivedLink.path
}
