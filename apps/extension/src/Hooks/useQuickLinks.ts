import useDataStore from '../Stores/useDataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { ListItemType } from '../Types/List'
import { getListItemFromNode, getListItemFromSnippet } from '../Utils/helper'

export const useQuickLinks = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const snippets = useSnippetStore((store) => store.snippets)

  const getQuickLinks = (): Array<ListItemType> => {
    const mILinks = ilinks.map((ilink) => getListItemFromNode(ilink))
    const mSnippets = snippets.map((snippet) => getListItemFromSnippet(snippet))

    return [...mILinks, ...mSnippets]
  }

  return {
    getQuickLinks
  }
}
