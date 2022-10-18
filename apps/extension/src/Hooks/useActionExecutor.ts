/* eslint-disable no-case-declarations */
import { createPlateEditor, createPlateUI, serializeHtml } from '@udecode/plate'
import toast from 'react-hot-toast'

import {
  ActionType,
  CategoryType,
  convertContentToRawText,
  convertToCopySnippet,
  createNodeWithUid,
  defaultCopyConverter,
  defaultCopyFilter,
  ELEMENT_PARAGRAPH,
  ELEMENT_TAG,
  getBlockMetadata,
  getNewDraftKey,
  ILink,
  MexitAction,
  mog,
  QuickLinkType,
  SEPARATOR,
  SingleNamespace
} from '@mexit/core'

import { CopyTag } from '../Editor/components/Tags/CopyTag'
import getPlugins from '../Editor/plugins/index'
import useDataStore from '../Stores/useDataStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { checkURL, getProfileData } from '../Utils/getProfileData'
import { useAuthStore } from './useAuth'
import { useEditorContext } from './useEditorContext'
import { useNamespaces } from './useNamespaces'
import { useNodes } from './useNodes'
import { useSaveChanges } from './useSaveChanges'
import { useSnippets } from './useSnippets'
import { useSputlitContext, VisualState } from './useSputlitContext'

export function useActionExecutor() {
  const { setVisualState, setActiveIndex } = useSputlitContext()
  const { setPersistedContent } = useEditorContext()
  const setNode = useSputlitStore((s) => s.setNode)
  const setResults = useSputlitStore((store) => store.setResults)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const { getSnippet } = useSnippets()
  const { ilinks, sharedNodes } = useDataStore()
  const { isSharedNode } = useNodes()
  const { saveIt } = useSaveChanges()
  const { getDefaultNamespace, getNamespaceOfNodeid } = useNamespaces()
  const setSearch = useSputlitStore((store) => store.setSearch)
  const changeSearchType = useSputlitStore((s) => s.changeSearchType)

  const setActiveItem = useSputlitStore((store) => store.setActiveItem)
  const setInput = useSputlitStore((s) => s.setInput)
  const resetSputlitState = useSputlitStore((s) => s.reset)

  function execute(item: MexitAction, metaKeyPressed?: boolean) {
    const search = useSputlitStore.getState().search
    const activeItem = useSputlitStore.getState().activeItem

    if (!item) {
      mog('No item found')
      return
    }

    switch (item.category) {
      case QuickLinkType.backlink: {
        switch (item.type) {
          case ActionType.OPEN:
            const url = encodeURI(item.extras.base_url)
            window.open(url, '_blank').focus()
            setVisualState(VisualState.hidden)
            resetSputlitState()

            break

          default:
            let node: ILink
            let namespace: SingleNamespace
            const val = search.value
            const nodeValue = val || getNewDraftKey()
            const defaultNamespace = getDefaultNamespace()

            if (item?.extras?.new) {
              node = createNodeWithUid(nodeValue, defaultNamespace.id)
              namespace = defaultNamespace
            } else {
              node = isSharedNode(item.id)
                ? sharedNodes.find((i) => i.nodeid === item.id)
                : ilinks.find((i) => i.nodeid === item.id)
              namespace = getNamespaceOfNodeid(node.nodeid)
            }

            setNode({
              id: node.nodeid,
              title: node.path.split(SEPARATOR).slice(-1)[0],
              path: node.path,
              nodeid: node.nodeid,
              namespace: namespace.id
            })

            saveIt(false, true)

            resetSputlitState()
        }

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

      case QuickLinkType.search: {
        if (item?.extras?.withinMex) {
          setActiveItem(item)
          changeSearchType(CategoryType.backlink)
        } else {
          const url = encodeURI(item.extras.base_url + search.value)
          window.open(url, '_blank').focus()
          setVisualState(VisualState.hidden)
          resetSputlitState()
        }

        break
      }

      case QuickLinkType.action: {
        switch (item.type) {
          case ActionType.BROWSER_EVENT:
            chrome.runtime.sendMessage({ ...item })
            break
          case ActionType.OPEN:
            if (metaKeyPressed) {
              navigator.clipboard.writeText(item.extras.base_url)
              toast.success('URL copied to clipboard!')
            } else {
              window.open(item.extras.base_url, '_blank').focus()
            }

            setVisualState(VisualState.hidden)
            resetSputlitState()

            break
          case ActionType.SEARCH: {
            // Ignore the case for search type action when it is the generic search action
            // As it is not a two step action
            if (item.extras.withinMex) {
              setActiveItem(item)
              setInput('')
              setSearch({ value: '', type: CategoryType.backlink })
            } else if (activeItem?.title !== item?.title && item?.id !== '0') {
              setActiveItem(item)
              setInput('')
            } else {
              const url = encodeURI(item.extras.base_url + search.value)
              window.open(url, '_blank').focus()
              setVisualState(VisualState.hidden)
              resetSputlitState()
            }

            break
          }
          case ActionType.RENDER: {
            setActiveItem(item)
            setInput('')
            setResults([])
            break
          }
          case ActionType.MAGICAL: {
            const webpage = checkURL(window.location.href)

            if (!webpage) {
              toast.error('No data available for extracting')
            } else {
              setActiveItem(item)
              getProfileData(webpage)
                .then((data) => {
                  setPersistedContent([
                    {
                      type: ELEMENT_PARAGRAPH,
                      children: data,
                      blockMeta: getBlockMetadata(window.location.href)
                    }
                  ])
                })
                .catch((err) => {
                  console.log('err:', err)
                })
              setActiveIndex(0)
              setInput('')
              setSearch({ value: '', type: CategoryType.action })
            }

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
