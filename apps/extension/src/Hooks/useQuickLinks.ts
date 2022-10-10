import { ListItemType } from '@mexit/core'

import useDataStore from '../Stores/useDataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { getListItemFromNode, getListItemFromSnippet } from '../Utils/helper'

export const useQuickLinks = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const snippets = useSnippetStore((store) => store.snippets)
  const sNodes = useDataStore((store) => store.sharedNodes)

  const getQuickLinks = (): Array<ListItemType> => {
    const mILinks = ilinks.map((ilink) => getListItemFromNode(ilink))
    const mSnippets = snippets.map((snippet) => getListItemFromSnippet(snippet))
    const sLinks = sNodes.map((node) => ({ ...getListItemFromNode(node), icon: 'ri:share-line' }))

    return [...mILinks, ...mSnippets, ...sLinks]
  }

  return {
    getQuickLinks
  }
}
