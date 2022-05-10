import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'
import InfoBar from '../Components/Infobar'
import useEditorActions from '../Hooks/useEditorActions'
import EditorErrorFallback from '../Components/Editor/EditorErrorFallback'
import { useAnalysis } from '../Stores/useAnalysis'
import { initSearchIndex } from '../Workers/controller'
import useDataStore from '../Stores/useDataStore'
import useContentStore from '../Stores/useContentStore'
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
  useAnalysis()

  useEffect(() => {
    const { ilinks, archive } = useDataStore.getState()
    const contents = useContentStore.getState().contents
    const snippets = useSnippetStore.getState().snippets

    initSearchIndex({ ilinks, archive, contents, snippets })
  }, [])

  return (
    <EditorViewWrapper>
      <ErrorBoundary onReset={resetEditor} FallbackComponent={EditorErrorFallback}>
        <Outlet />
      </ErrorBoundary>
      <InfoBar />
    </EditorViewWrapper>
  )
}

export default EditorView
