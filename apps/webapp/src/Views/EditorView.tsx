import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

import { tinykeys } from '@workduck-io/tinykeys'

import EditorErrorFallback from '../Components/Editor/EditorErrorFallback'
import useEditorActions from '../Hooks/useEditorActions'
import { useAnalysis } from '../Stores/useAnalysis'
import useBlockStore from '../Stores/useBlockStore'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { initSearchIndex } from '../Workers/controller'
import styled from 'styled-components'

export const EditorViewWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  overflow: inherit hidden;
  max-width: 860px;
  min-width: 400px;
  margin: 0 auto;
`

const EditorView = () => {
  const { resetEditor } = useEditorActions()
  const { ilinks, archive, sharedNodes } = useDataStore()
  const contents = useContentStore((state) => state.contents)
  const snippets = useSnippetStore((state) => state.snippets)
  const [first, setFirst] = useState(true)

  useAnalysis()

  // * Why do we need this?
  // useEffect(() => {
  //   async function fetchSharedAndPortals() {
  //     const fetchSharedDataPromise = fetchShareData()
  //     const initPortalsPromise = initPortals()

  //     await Promise.allSettled([fetchSharedDataPromise, initPortalsPromise])
  //   }
  //   fetchSharedAndPortals()
  // }, [workspaceDetails]) // eslint-disable-line

  useEffect(() => {
    if (!first) {
      initSearchIndex({ ilinks, archive, contents, snippets, sharedNodes })
    } else {
      setFirst(false)
    }
  }, [ilinks, archive, contents, snippets]) // eslint-disable-line react-hooks/exhaustive-deps

  // const location = useLocation()
  // const showInfoBar = () => {
  //   if (location.pathname.startsWith('/editor')) return true
  // }

  // const shortcuts = useHelpStore((store) => store.shortcuts)
  // const node = useEditorStore((store) => store.node)
  // const { shortcutDisabled, shortcutHandler } = useKeyListener()

  // const { goTo } = useRouting()
  // const { loadNode } = useLoad()

  const focusMode = useLayoutStore((s) => s.focusMode)
  const toggleFocusMode = useLayoutStore((s) => s.toggleFocusMode)

  useEffect(() => {
    if (focusMode.on) {
      const unsubscribe = tinykeys(window, {
        Escape: (event) => {
          event.preventDefault()
          toggleFocusMode()
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [focusMode]) // eslint-disable-line react-hooks/exhaustive-deps

  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  useEffect(() => {
    if (isBlockMode) {
      const unsubscribe = tinykeys(window, {
        Escape: (event) => {
          event.preventDefault()
          setIsBlockMode(false)
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [isBlockMode]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <EditorViewWrapper>
      <ErrorBoundary onReset={resetEditor} FallbackComponent={EditorErrorFallback}>
        <Outlet />
      </ErrorBoundary>
    </EditorViewWrapper>
  )
}

export default EditorView
