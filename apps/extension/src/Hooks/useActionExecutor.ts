import {
  ActionType,
  CategoryType,
  createNodeWithUid,
  getNewDraftKey,
  getUntitledDraftKey,
  ILink,
  MexitAction,
  parseSnippet,
  QuickLinkType,
  SEPARATOR
} from '@mexit/core'
import { copyToClipboard } from '@mexit/shared'
import toast from 'react-hot-toast'
import Action from '../Components/Action'
import { StyledInput } from '../Components/Search/styled'
import useDataStore from '../Stores/useDataStore'
import { useAuthStore } from './useAuth'
import { useEditorContext } from './useEditorContext'
import { useSnippets } from './useSnippets'
import { useSputlitContext, VisualState } from './useSputlitContext'
import { useSaveChanges } from './useSaveChanges'

export function useActionExecutor() {
  const { setVisualState, search, activeItem, setActiveItem, setSearch, setInput, setSearchResults } =
    useSputlitContext()
  const { setNodeContent, setPreviewMode, setNode } = useEditorContext()
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const { getSnippet } = useSnippets()
  const { ilinks } = useDataStore()
  const { saveIt } = useSaveChanges()

  function execute(item: MexitAction, metaKeyPressed?: boolean) {
    switch (item.category) {
      case QuickLinkType.backlink: {
        let node: ILink
        const val = search.type === CategoryType.backlink ? search.value.slice(2) : search.value
        const nodeValue = val || getNewDraftKey()

        if (item?.extras?.new) {
          node = createNodeWithUid(nodeValue)
        } else {
          node = ilinks.find((i) => i.nodeid === item.id)
        }

        setNode({
          id: node.nodeid,
          title: node.path.split(SEPARATOR).slice(-1)[0],
          path: node.path,
          nodeid: node.nodeid
        })

        if (metaKeyPressed) {
          saveIt(false, true)
        } else {
          setPreviewMode(false)
        }

        setInput('')
        break
      }
      case QuickLinkType.snippet: {
        const snippet = getSnippet(item.id)
        copyToClipboard(parseSnippet(snippet).text)
        setVisualState(VisualState.hidden)
        break
      }
      case QuickLinkType.action: {
        switch (item.type) {
          case ActionType.BROWSER_EVENT:
            chrome.runtime.sendMessage({ ...item })
            break
          case ActionType.OPEN:
            window.open(item.data.base_url, '_blank').focus()
            setVisualState(VisualState.hidden)
            break
          case ActionType.SEARCH: {
            // Ignore the case for search type action when it is the generic search action
            // As it is not a two step action
            if (activeItem?.title !== item?.title && item?.id !== '0') {
              setActiveItem(item)
              setInput('')
            } else {
              const url = encodeURI(item.data.base_url + search.value)
              window.open(url, '_blank').focus()
              setVisualState(VisualState.hidden)
            }
            break
          }
          case ActionType.RENDER: {
            setActiveItem(item)
            setInput('')
            setSearchResults([])
            break
          }
          case ActionType.SCREENSHOT: {
            setVisualState(VisualState.animatingOut)
            toast.loading('Taking a screenshot', { duration: 800 })
            setTimeout(() => {
              chrome.runtime.sendMessage(
                {
                  type: 'ASYNC_ACTION_HANDLER',
                  subType: 'CAPTURE_VISIBLE_TAB',
                  data: {
                    workspaceId: workspaceDetails.id
                  }
                },
                (response) => {
                  const { message, error } = response
                  if (error) {
                    toast.error('Could not capture screenshot')
                  } else {
                    setVisualState(VisualState.animatingIn)
                    // Adding a paragraph in the start due to errors caused by editor
                    // trying to focus in the start of the note
                    setNodeContent([
                      {
                        type: 'p',
                        children: [
                          {
                            text: 'Screenshot'
                          }
                        ]
                      },
                      {
                        children: [
                          {
                            text: ''
                          }
                        ],
                        type: 'img',
                        url: message
                      },
                      {
                        text: '\n'
                      },
                      {
                        text: '['
                      },
                      {
                        type: 'a',
                        url: message,
                        children: [
                          {
                            text: 'Ref'
                          }
                        ]
                      },
                      {
                        text: ' ]'
                      }
                    ])
                  }
                }
              )
            }, 1000)
          }
        }
      }
    }
  }

  return { execute }
}
