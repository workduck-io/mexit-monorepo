/* eslint-disable no-case-declarations */
import toast from 'react-hot-toast'

import {
  ActionType,
  CategoryType,
  createNodeWithUid,
  getNewDraftKey,
  ILink,
  ListItemType,
  loremIpsum,
  MexitAction,
  mog,
  QuickLinkType,
  SEPARATOR,
  SingleNamespace
} from '@mexit/core'
import { copyTextToClipboard } from '@mexit/shared'

import useDataStore from '../Stores/useDataStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useSmartCaptureStore } from '../Stores/useSmartCaptureStore'
import { useSputlitStore } from '../Stores/useSputlitStore'
import { evaluateConfig } from '../Utils/evalSmartCapture'
import { generateAvatar } from '../Utils/generateAvatar'
import { copySnippetToClipboard } from '../Utils/pasteUtils'

import { useAuthStore } from './useAuth'
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
  const { getSnippet } = useSnippets()
  const { ilinks, sharedNodes } = useDataStore()
  const { isSharedNode } = useNodes()
  const { saveIt } = useSaveChanges()
  const { getDefaultNamespace, getNamespaceOfNodeid } = useNamespaces()
  const setSearch = useSputlitStore((store) => store.setSearch)
  const changeSearchType = useSputlitStore((s) => s.changeSearchType)
  const toggleRHSidebar = useLayoutStore((s) => s.toggleRHSidebar)

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

            if (!links.find((l) => l.url === window.location.href)) {
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
                    // mog('Success! We got an image (w e t h i n k s)', { item })

                    // Use renderer to render screenshot??
                    // How to pass it to screenshot?
                    const base64Image = message
                    setScreenshot(base64Image)

                    // Adding a paragraph in the start due to errors caused by editor
                    // trying to focus in the start of the note
                    setActiveItem(item)
                    // TODO: Move smallContent from mex-electron to mex-space
                    // TODO: Use smallContent from mex-space.
                    // setPersistedContent([
                    //   { type: 'p', children: [{ text: 'Screenshot' }] },
                    //   { children: [{ text: '' }], type: 'img' /* url: message */ },
                    //   { text: '\n' },
                    //   { text: '[' },
                    //   { type: 'a', url: message, children: [{ text: 'Ref' }] },
                    //   { text: ' ]' }
                    // ])
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
