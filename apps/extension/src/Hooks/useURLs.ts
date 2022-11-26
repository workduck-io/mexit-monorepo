import md5 from 'md5'
import toast from 'react-hot-toast'

import { extractLinksFromData, Link, mog, Settify, WORKSPACE_HEADER } from '@mexit/core'

import useDataStore from '../Stores/useDataStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useAuthStore } from './useAuth'

export const useLinkURLs = () => {
  const links = useLinkStore((store) => store.links)
  const tags = useDataStore((store) => store.tags)
  const setLinks = useLinkStore((store) => store.setLinks)
  const highlights = useHighlightStore((state) => state.highlighted)

  const { saveLink, deleteLink: deleteLinkAPI } = useURLsAPI()

  const getTags = (present?: string[]) => {
    const linkTags = links.reduce((acc, link) => {
      if (link.tags) {
        acc.push(...link.tags)
      }
      return acc
    }, [] as string[])

    const mergedTags = Settify([...linkTags, ...tags.map((t) => t.value)])
      .filter((tag) => (present ? !present.includes(tag) : true))
      .map((t) => ({ value: t }))

    return mergedTags
  }

  const getHighlights = (link: Link) => {
    const highlightOfUrl = highlights[link.url]

    // mog('getting highlights for', { link, highlightOfUrl, highlights })
    if (highlightOfUrl) {
      return highlightOfUrl
    }
  }

  const addTag = (linkurl: string, tag: string) => {
    const newLinks = links.map((l) => {
      if (l.url === linkurl) {
        return { ...l, tags: Settify([...(l.tags ?? []), tag]) }
      }
      return l
    })

    const newLink = newLinks.find((l) => l.url === linkurl)
    saveLink(newLink)
    mog('addTag', { linkurl, tag, newLinks })
    setLinks(newLinks)
  }

  const removeTag = (linkurl: string, tag: string) => {
    const newLinks = links.map((l) => {
      if (l.url === linkurl) {
        return { ...l, tags: (l.tags ?? []).filter((t) => t !== tag) }
      }
      return l
    })

    const newLink = newLinks.find((l) => l.url === linkurl)
    saveLink(newLink)
    mog('removeTag', { linkurl, tag, newLinks })
    setLinks(newLinks)
  }

  const isDuplicateAlias = (alias: string): boolean => {
    return !!links.some((l) => l.alias === alias)
  }

  const updateAlias = (linkurl: string, alias: string) => {
    const newLinks = links.map((l) => {
      if (l.url === linkurl) {
        return { ...l, alias: alias }
      }
      return l
    })

    const newLink = newLinks.find((l) => l.url === linkurl)
    saveLink(newLink)
    mog('updateAlias', { linkurl, alias, newLinks })
    setLinks(newLinks)
  }

  const deleteLink = (linkurl: string) => {
    const toDelete = links.find((l) => l.url === linkurl)
    const newLinks = links.filter((l) => l.url !== linkurl)
    mog('deleteLink', { linkurl, toDelete, newLinks })
    deleteLinkAPI(toDelete)
    setLinks(newLinks)
  }

  const getLink = (linkurl: string) => {
    return links.find((l) => l.url === linkurl)
  }

  return {
    getTags,
    addTag,
    removeTag,
    updateAlias,
    isDuplicateAlias,
    deleteLink,
    getLink,
    getHighlights
  }
}

export const useURLsAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setLinks = useLinkStore((store) => store.setLinks)

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  /**
   * Fetches all links of the workspace
   */
  const getAllLinks = async () => {
    const request = {
      type: 'SHORTENER',
      subType: 'GET_ALL_LINKS',
      headers: workspaceHeaders()
    }

    const links = chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error) {
        mog('ErrorFetchingAllLinks', error)
        toast.error('An error occured. Please try again.')
      } else {
        mog('extract links', { message })
        return extractLinksFromData(message)
      }
    })

    return links
  }

  const saveLink = async (link: Link) => {
    const request = {
      type: 'SHORTENER',
      subType: 'SAVE_LINK',
      headers: workspaceHeaders(),
      body: {
        url: link.url,
        alias: link.alias,
        properties: { title: link.title },
        tags: link.tags
      }
    }

    const data = chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error) {
        mog('ErrorSavingLink', error)
        toast.error('An error occured. Please try again.')
      } else {
        return message
      }
    })

    return data
  }

  const deleteLink = async (link: Link) => {
    const workspaceId = getWorkspaceId()
    const request = {
      headers: workspaceHeaders(),
      body: {
        hashedURL: md5(`${workspaceId}${link.url}`)
      }
    }

    const data = chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error) {
        mog('ErrorDeletingLink', error)
        toast.error('An error occured. Please try again.')
      } else {
        return message
      }
    })

    return data
    // OOK
  }

  return { getAllLinks, saveLink, deleteLink }
}
