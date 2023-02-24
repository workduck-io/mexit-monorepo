import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet, useParams } from 'react-router-dom'

import styled from 'styled-components'

import { tinykeys } from '@workduck-io/tinykeys'

import { StyledEditor } from '@mexit/shared'

import EditorErrorFallback from '../Components/Editor/EditorErrorFallback'
import EditorHeader from '../Components/Editor/EditorHeader'
import useEditorActions from '../Hooks/useEditorActions'
import { useAnalysis } from '../Stores/useAnalysis'
import useBlockStore from '../Stores/useBlockStore'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { initSearchIndex } from '../Workers/controller'

export const EditorViewWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  overflow: inherit hidden;
  max-width: 852px;
  min-width: 400px;
  margin: 0 auto;
`

const EditorView = () => {
  const [first, setFirst] = useState(true)
  useAnalysis()
  const noteId = useParams()?.nodeId
  const { resetEditor } = useEditorActions()
  const { ilinks, archive, sharedNodes } = useDataStore()

  const infobar = useLayoutStore((store) => store.infobar)
  const contents = useContentStore((state) => state.contents)
  const snippets = useSnippetStore((state) => state.snippets)
  const focusMode = useLayoutStore((s) => s.focusMode)
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)
  const toggleFocusMode = useLayoutStore((s) => s.toggleFocusMode)

  useEffect(() => {
    if (!first) {
      initSearchIndex({ ilinks, archive, contents, snippets, sharedNodes })
    } else {
      setFirst(false)
    }
  }, [ilinks, archive, contents, snippets]) // eslint-disable-line react-hooks/exhaustive-deps

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
    <EditorViewWrapper id="mexit-editor-view-wrapper">
      <StyledEditor id="mexit-editor-container" showGraph={infobar.mode === 'graph'} className="mex_editor">
        <EditorHeader noteId={noteId} />
        <ErrorBoundary onReset={resetEditor} FallbackComponent={EditorErrorFallback}>
          <Outlet />
        </ErrorBoundary>
      </StyledEditor>
    </EditorViewWrapper>
  )
}

export default EditorView
