import {
  ActionType,
  CategoryType,
  convertContentToRawText,
  convertToCopySnippet,
  createNodeWithUid,
  defaultCopyConverter,
  defaultCopyFilter,
  ELEMENT_TAG,
  getNewDraftKey,
  getUntitledDraftKey,
  ILink,
  MexitAction,
  mog,
  parseSnippet,
  QuickLinkType,
  SEPARATOR
} from '@mexit/core'
import toast from 'react-hot-toast'
import Action from '../Components/Action'
import { StyledInput } from '../Components/Search/styled'
import useDataStore from '../Stores/useDataStore'
import { useAuthStore } from './useAuth'
import { useEditorContext } from './useEditorContext'
import { useSnippets } from './useSnippets'
import { useSputlitContext, VisualState } from './useSputlitContext'
import { useSaveChanges } from './useSaveChanges'
import { createPlateEditor, createPlateUI, serializeHtml } from '@udecode/plate'
import { CopyTag } from '../Editor/components/Tags/CopyTag'

import getPlugins from '../Editor/plugins/index'

export function useActionExecutor() {
  const { setVisualState, search, activeItem, setActiveItem, setSearch, setInput, setSearchResults } =
    useSputlitContext()
  const { setNodeContent, setPreviewMode, setNode, setPersistedContent } = useEditorContext()
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
        const text = convertContentToRawText(snippet.content, '\n')

        let html = text

        try {
          const filterdContent = convertToCopySnippet(snippet.content)
          const convertedContent = convertToCopySnippet(filterdContent, {
            filter: defaultCopyFilter,
            converter: defaultCopyConverter
          })

          const tempEditor = createPlateEditor({
            plugins: getPlugins(
              createPlateUI({
                [ELEMENT_TAG]: CopyTag as any
              }),
              {
                exclude: { dnd: true }
              }
            )
          })

          html = serializeHtml(tempEditor, {
            nodes: convertedContent
          })
        } catch (err) {
          mog('Something went wrong', { err })
        }

        //Copying both the html and text in clipboard
        const textBlob = new Blob([text], { type: 'text/plain' })
        const htmlBlob = new Blob([html], { type: 'text/html' })
        const data = [new ClipboardItem({ ['text/plain']: textBlob, ['text/html']: htmlBlob })]

        navigator.clipboard.write(data)

        toast.success('Snippet copied to clipboard!')
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
                    setActiveItem(item)
                    setPersistedContent([
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
