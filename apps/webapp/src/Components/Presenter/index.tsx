import 'reveal.js/dist/reveal.css'

import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { usePlateEditorRef } from '@udecode/plate'
import Markdown from 'markdown-to-jsx'
import Reveal from 'reveal.js'

import { tinykeys } from '@workduck-io/tinykeys'

import { ELEMENT_PARAGRAPH, SECTION_SEPARATOR, SLIDE_SEPARATOR, useContentStore } from '@mexit/core'

import parseToMarkdown from '../../Editor/utils'

import { PresenterContainer } from './styled'

const Presenter = () => {
  const [markdown, setMarkdown] = useState('#Loading...')
  const presenterRef = useRef<HTMLDivElement>(null)

  const noteId = useParams().nodeId
  // * Get query parameter present from url using react-router-dom v6
  const [searchParams, setSearchParams] = useSearchParams()
  const isPresenting = searchParams.get('present') === 'true'

  const editor = usePlateEditorRef(noteId)

  const goFullScreen = (element: any) => {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  }

  const setMarkdownFromEditor = () => {
    const content = editor?.children ?? useContentStore.getState().getContent(noteId)?.content
    const markdownContent = parseToMarkdown({ children: content, type: ELEMENT_PARAGRAPH })
    setMarkdown(markdownContent)
  }

  useEffect(() => {
    if (isPresenting) {
      Reveal.initialize().then(() => {
        setMarkdownFromEditor()
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

  if (!markdown?.length) return

  return (
    <PresenterContainer $isPresenting={isPresenting} className="reveal" ref={presenterRef}>
      <div className="slides">
        {markdown?.split(SLIDE_SEPARATOR)?.map((slideContent, idx) => (
          <section key={idx}>
            {slideContent?.split(SECTION_SEPARATOR)?.map((sectionContent, idxN) => (
              <section key={`${idx}_${idxN}`}>
                <Markdown>{sectionContent}</Markdown>
              </section>
            ))}
          </section>
        ))}
      </div>
    </PresenterContainer>
  )
}

export default Presenter
