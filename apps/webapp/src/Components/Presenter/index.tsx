import 'reveal.js/dist/reveal.css'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { usePlateEditorRef } from '@udecode/plate'
import Reveal from 'reveal.js'

import { tinykeys } from '@workduck-io/tinykeys'

import { FeatureFlags, NodeEditorContent, useContentStore } from '@mexit/core'
import { FeatureFlag } from '@mexit/shared'

import { splitToSlides } from '../../Editor/presenterUtils'
import { createViewFilterStore, ViewFilterProvider } from '../../Hooks/todo/useTodoFilters'
import Editor from '../Editor/Editor'

import { PresenterContainer } from './styled'

const Presenter = () => {
  const [slidesContent, setSlideContent] = useState<NodeEditorContent[][]>([[[]]])
  const presenterRef = useRef<HTMLDivElement>(null)

  const noteId = useParams().nodeId
  // * Get query parameter present from url using react-router-dom v6
  const [searchParams, setSearchParams] = useSearchParams()
  const isPresenting = searchParams.get('present') === 'true'

  const editor = usePlateEditorRef(noteId)
  const content = editor?.children ?? useContentStore.getState().getContent(noteId)?.content

  const goFullScreen = (element: any) => {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  }

  const setContentFromEditor = () => {
    setSlideContent(splitToSlides(content))
  }

  useEffect(() => {
    if (isPresenting) {
      Reveal.initialize().then(() => {
        setContentFromEditor()
      })

      const unsubscribe = tinykeys(window, {
        Escape: (e) => {
          setSearchParams()

          // * If overview is open, close it
          if (Reveal.isOverview()) {
            Reveal.toggleOverview()
          }
        }
      })

      return () => {
        unsubscribe()
        setSearchParams()

        // * Destroy reveal instance, as it creates multiple elements in the DOM
        Reveal.destroy()
      }
    }
  }, [isPresenting, noteId])

  return (
    <PresenterContainer $isPresenting={isPresenting} className="reveal" ref={presenterRef}>
      <div className="slides">
        {slidesContent?.map(
          (slideContent, idx) =>
            isPresenting && (
              <section key={idx}>
                {slideContent?.map((sectionContent, idxN) => (
                  <section key={`${idx}_${idxN}`}>
                    <ViewFilterProvider createStore={createViewFilterStore}>
                      <Editor
                        // includeBlockInfo={true}
                        content={sectionContent}
                        nodeUID={`${noteId}_EDITOR_${idx}_${idxN}`}
                        readOnly={true}
                        autoFocus={false}
                      />
                    </ViewFilterProvider>
                  </section>
                ))}
              </section>
            )
        )}
      </div>
    </PresenterContainer>
  )
}

const PresentationFeature = () => (
  <FeatureFlag name={FeatureFlags.PRESENTATION}>
    <Presenter />
  </FeatureFlag>
)

export default PresentationFeature
