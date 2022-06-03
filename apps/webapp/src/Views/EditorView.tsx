import React, { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet, useLocation } from 'react-router-dom'
import tinykeys from 'tinykeys'
import styled from 'styled-components'

import InfoBar from '../Components/Infobar'
import useEditorActions from '../Hooks/useEditorActions'
import EditorErrorFallback from '../Components/Editor/EditorErrorFallback'
import { useAnalysis } from '../Stores/useAnalysis'
import { initSearchIndex } from '../Workers/controller'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'

const EditorViewWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const EditorView = () => {
  const { resetEditor } = useEditorActions()
  const { ilinks, archive } = useDataStore()
  const contents = useContentStore((state) => state.contents)
  const snippets = useSnippetStore((state) => state.snippets)
  const [first, setFirst] = useState(true)

  useAnalysis()

  useEffect(() => {
    if (!first) {
      initSearchIndex({ ilinks, archive, contents, snippets })
    } else {
      setFirst(false)
    }
  }, [ilinks, archive, contents, snippets]) // eslint-disable-line react-hooks/exhaustive-deps

  const location = useLocation()
  const showInfoBar = () => {
    if (location.pathname.startsWith('/editor')) return true
  }

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const node = useEditorStore((store) => store.node)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  const { goTo } = useRouting()
  const { loadNode } = useLoad()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showSnippets.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSnippets, () => {
          goTo(ROUTE_PATHS.snippets, NavigationType.push)
        })
      },
      [shortcuts.showEditor.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showEditor, () => {
          if (node.nodeid === '__null__') {
            loadNode(ilinks.find((ilink) => ilink.path === '@').nodeid)
          }
          loadNode(node.nodeid)
          goTo(ROUTE_PATHS.node, NavigationType.push, node.nodeid)
        })
      },
      [shortcuts.showTasks.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showEditor, () => {
          goTo(ROUTE_PATHS.tasks, NavigationType.push)
        })
      },
      [shortcuts.showArchive.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showArchive, () => {
          goTo(ROUTE_PATHS.archive, NavigationType.push)
        })
      },
      [shortcuts.showSearch.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSearch, () => {
          goTo(ROUTE_PATHS.search, NavigationType.push)
        })
      },
      [shortcuts.showSettings.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSettings, () => {
          goTo(`${ROUTE_PATHS.settings}/about`, NavigationType.push)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, node.nodeid, ilinks]) // eslint-disable-line react-hooks/exhaustive-deps

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
      {showInfoBar() && <InfoBar />}
    </EditorViewWrapper>
  )
}

export default EditorView
