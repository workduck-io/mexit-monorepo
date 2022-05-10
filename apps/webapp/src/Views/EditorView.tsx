import React, { useEffect, useState } from 'react'
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
  }, [ilinks, archive, contents, snippets])

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
