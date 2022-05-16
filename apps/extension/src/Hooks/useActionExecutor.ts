import { ActionType, CategoryType, MexitAction, parseSnippet, QuickLinkType } from '@mexit/core'
import { copyToClipboard } from '@mexit/shared'
import toast from 'react-hot-toast'
import Action from '../Components/Action'
import { StyledInput } from '../Components/Search/styled'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useAuthStore } from './useAuth'
import { useContentStore } from './useContentStore'
import { useEditorContext } from './useEditorContext'
import { useSnippets } from './useSnippets'
import { useSputlitContext, VisualState } from './useSputlitContext'

export function useActionExecutor() {
  const { setVisualState, search, activeItem, setActiveItem, setSearch, setSearchResults } = useSputlitContext()
  const { setNodeContent, setPreviewMode, setNode } = useEditorContext()
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const { getContent } = useContentStore()
  const { getSnippet } = useSnippets()

  function execute(item: MexitAction) {
    switch (item.category) {
      case QuickLinkType.backlink:
        setPreviewMode(false)
        setSearch({ value: '', type: CategoryType.search })
        break
      case QuickLinkType.snippet:
        const snippet = getSnippet(item.id)
        copyToClipboard(parseSnippet(snippet).text)
        setVisualState(VisualState.hidden)
        break
      case QuickLinkType.action:
        switch (item.type) {
          case ActionType.BROWSER_EVENT:
            chrome.runtime.sendMessage({ ...item })
            break
          case ActionType.OPEN:
            window.open(item.data.base_url, '_blank').focus()
            setVisualState(VisualState.hidden)
            break
          case ActionType.SEARCH: {
            if (activeItem !== item) {
              setActiveItem(item)
            } else {
              const url = encodeURI(item.data.base_url + search.value)
              window.open(url, '_blank').focus()
              setVisualState(VisualState.hidden)
            }
            break
          }
          case ActionType.RENDER: {
            setActiveItem(item)
            setSearchResults([])
            break
          }
          case ActionType.SCREENSHOT: {
            setVisualState(VisualState.hidden)
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
                  setVisualState(VisualState.showing)
                  setNodeContent([
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
          }
        }
    }
  }

  return { execute }
}
