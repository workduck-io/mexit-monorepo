/* eslint-disable no-case-declarations */
import toast from 'react-hot-toast'

import {
  ActionType,
  CategoryType,
  createNodeWithUid,
  deleteQueryParams,
  DRAFT_NODE,
  generateSnippetId,
  getNewDraftKey,
  getSlug,
  ILink,
  ListItemType,
  loremIpsum,
  MexitAction,
  mog,
  QuickLinkType,
  SEPARATOR,
  SingleNamespace,
  useAuthStore,
  useDataStore,
  useLayoutStore,
  useLinkStore,
  useSmartCaptureStore
} from '@mexit/core'
import { copyTextToClipboard } from '@mexit/shared'

import { useSputlitStore } from '../Stores/useSputlitStore'
import { evaluateConfig } from '../Utils/evalSmartCapture'
import { generateAvatar } from '../Utils/generateAvatar'
import { copySnippetToClipboard } from '../Utils/pasteUtils'

import { useEditorStore } from './useEditorStore'
import { useNamespaces } from './useNamespaces'
import { useNodes } from './useNodes'
import { useSaveChanges } from './useSaveChanges'
import { useSnippets } from './useSnippets'
import { useSputlitContext, VisualState } from './useSputlitContext'
import { useLinkURLs } from './useURLs'

export function useActionExecutor() {
  const { setVisualState, setActiveIndex } = useSputlitContext()
  const setNode = useSputlitStore((s) => s.setNode)
  const setResults = useSputlitStore((store) => store.setResults)
  const setScreenshot = useSputlitStore((store) => store.setScreenshot)
  const setAvatarSeed = useSputlitStore((store) => store.setAvatarSeed)
  const getMatchingConfig = useSmartCaptureStore((store) => store.getMatchingURLConfig)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const { getSnippet, addSnippet } = useSnippets()
  const { ilinks, sharedNodes } = useDataStore()
  const { isSharedNode } = useNodes()
  const { saveIt, appendAndSave } = useSaveChanges()
  const { getDefaultNamespace, getNamespaceOfNodeid } = useNamespaces()
  const setSearch = useSputlitStore((store) => store.setSearch)
  const changeSearchType = useSputlitStore((s) => s.changeSearchType)
  const toggleRHSidebar = useLayoutStore((s) => s.toggleRHSidebar)
  const toggleExtensionSidebar = useLayoutStore((s) => s.toggleExtensionSidebar)

  const setActiveItem = useSputlitStore((store) => store.setActiveItem)
  const setInput = useSputlitStore((s) => s.setInput)
  const resetSputlitState = useSputlitStore((s) => s.reset)
  const setSmartCaptureFormData = useSputlitStore((s) => s.setSmartCaptureFormData)

  const links = useLinkStore((s) => s.links)
  const { saveLink } = useLinkURLs()

  function execute(item: MexitAction | ListItemType, metaKeyPressed?: boolean) {
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
            setVisualState(VisualState.animatingOut)
            resetSputlitState()

            break

          default:
            const content = useEditorStore.getState().nodeContent
            if (item.extras.new && item.extras.newItemType === 'snippet') {
              const title = getSlug(search.value !== '' ? search.value : DRAFT_NODE)

              addSnippet({
                id: generateSnippetId(),
                title,
                content,
                template: false
              })

              break
            }

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

            if (item?.extras?.new) {
              saveIt({
                saveAndExit: false,
                notification: true
              })
            } else appendAndSave({ nodeid: node.nodeid, content, highlight: true })

            const urlToFind = deleteQueryParams(window.location.href)
            if (!links.find((l) => l.url === urlToFind)) {
              const link = { url: window.location.href, title: document.title }
              saveLink(link)
            }

            resetSputlitState()
        }

        break
      }

      case QuickLinkType.snippet: {
        const snippet = getSnippet(item.id)
        copySnippetToClipboard(snippet)
        setVisualState(VisualState.animatingOut)
        break
      }

      case QuickLinkType.search: {
        if (item?.extras?.withinMex) {
          setActiveItem(item)
          changeSearchType(CategoryType.backlink)
        } else {
          const url = encodeURI(item.extras.base_url + search.value)
          window.open(url, '_blank').focus()
          setVisualState(VisualState.animatingOut)
          resetSputlitState()
        }

        break
      }

      case QuickLinkType.action: {
        switch (item.type) {
          case ActionType.TOGGLE:
            toggleExtensionSidebar()
            break
          case ActionType.BROWSER_EVENT:
            // mog('Perform this action', { item })
            chrome.runtime.sendMessage({ ...item })
            break
          case ActionType.RIGHT_SIDEBAR:
            toggleRHSidebar()
            setVisualState(VisualState.animatingOut)
            break
          case ActionType.OPEN:
            if (metaKeyPressed) {
              navigator.clipboard.writeText(item.extras.base_url)
              toast.success('URL copied to clipboard!')
            } else {
              window.open(item.extras.base_url, '_blank').focus()
            }

            setVisualState(VisualState.animatingOut)
            resetSputlitState()

            break
          case ActionType.LOREM_IPSUM:
            // Copy a random paragraph from the lorem ipsum array
            copyTextToClipboard(loremIpsum[Math.floor(Math.random() * loremIpsum.length)])

            setVisualState(VisualState.animatingOut)
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
              setVisualState(VisualState.animatingOut)
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
            const strippedURL = window.location.origin + window.location.pathname
            const captureConfig = getMatchingConfig(strippedURL)
            if (!captureConfig) toast.error('No data available for extracting')
            else {
              try {
                const data = evaluateConfig(captureConfig)

                setSmartCaptureFormData({ source: strippedURL, page: captureConfig.base, data: data })
                setActiveItem(item)
              } catch (err) {
                console.error('err:', err)
              } finally {
                setActiveIndex(0)
                setInput('')
                setSearch({ value: '', type: CategoryType.action })
              }
            }
            break
          }
          case ActionType.AVATAR_GENERATOR: {
            const data = generateAvatar()
            setScreenshot(data.svg)
            setAvatarSeed(data.seed)

            setActiveItem(item)
            setInput('')
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
                    workspaceId: workspaceDetails?.id
                  }
                },
                (response) => {
                  const { message, error } = response
                  if (error) {
                    mog('Screen capture error', { error })
                    toast.error('Could not capture screenshot')
                  } else {
                    setVisualState(VisualState.animatingIn)
                    const base64Image = message
                    setScreenshot(base64Image)
                    setActiveItem(item)
                  }
                }
              )
            }, 1000)
            break
          }
          case ActionType.HIGHLIGHT: {
            // Execute
          }
        }
      }
    }
  }

  return { execute }
}
