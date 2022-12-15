import { ListItemType } from '@mexit/core'
import { DefaultMIcons } from '@mexit/shared'

import useDataStore from '../Stores/useDataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { getListItemFromNode, getListItemFromSnippet } from '../Utils/helper'

export const useQuickLinks = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const snippets = useSnippetStore((store) => store.snippets)
  const sNodes = useDataStore((store) => store.sharedNodes)

  const getQuickLinks = (): Array<ListItemType> => {
    const mILinks = ilinks.map((ilink) => getListItemFromNode(ilink))
    const mSnippets = Object.values(snippets).map((snippet) => getListItemFromSnippet(snippet))
    const sLinks = sNodes.map((node) => ({ ...getListItemFromNode(node), icon: DefaultMIcons.SHARED_NOTE }))

    return [...mILinks, ...mSnippets, ...sLinks]
  }

  return {
    getQuickLinks
  }
}
