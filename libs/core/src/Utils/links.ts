import { isEqual, uniq } from 'lodash'

import { CachedILink } from '../Types/Editor'

const ELEMENT_INLINE_BLOCK = 'inline_block'

export const hasLink = (link: CachedILink, links: CachedILink[]): boolean => {
  const filtered = links.filter((l) => {
    return link.nodeid === l.nodeid && link.type === l.type
  })
  return filtered.length > 0
}

export const removeLink = (link: CachedILink, setLinks: CachedILink[]): CachedILink[] => {
  return setLinks.filter((l) => !isEqual(l, link))
}

export const getLinksFromContent = (content: any[]): string[] => {
  let links: string[] = []
  content?.forEach((n) => {
    if (n.type === 'ilink' || n.type === ELEMENT_INLINE_BLOCK) {
      links.push(n.value)
    }
    if (n.children && n.children.length > 0) {
      links = links.concat(getLinksFromContent(n.children))
    }
  })

  return uniq(links)
}

export const deleteQueryParams = (link: string, queryParams: string[] = ['scrollToCapture']): string | undefined => {
  if (!link) return undefined

  const url = new URL(link)

  queryParams.forEach((param) => {
    url.searchParams.delete(param)
  })

  return url.href
}

export const appendQueryParams = (link: string, queryParams: Record<string, string> = {}): string | undefined => {
  if (!link) return undefined

  const url = new URL(link)

  Object.entries(queryParams).map(([key, val]) => {
    url.searchParams.append(key, val)
  })

  return url.href
}
