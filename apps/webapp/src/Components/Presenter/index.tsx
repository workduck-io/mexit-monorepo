import 'reveal.js/dist/reveal.css'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { usePlateEditorRef } from '@udecode/plate'
import Markdown from 'markdown-to-jsx'
import Reveal from 'reveal.js'

import { tinykeys } from '@workduck-io/tinykeys'

import { ELEMENT_PARAGRAPH, useContentStore } from '@mexit/core'

import parseToMarkdown from '../../Editor/utils'
import { useEditorStore } from '../../Stores/useEditorStore'

import { PresenterContainer } from './styled'

const Presenter = () => {
  const [markdown, setMarkdown] = useState('#Loading...')
  const presenterRef = useRef<HTMLDivElement>(null)

  const noteId = useParams().nodeId
  const editor = usePlateEditorRef(noteId)
  const isPresenting = useEditorStore((store) => store.isPresenting)
  const setIsPresenting = useEditorStore((store) => store.setIsPresenting)

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
          setIsPresenting(false)

          // * If overview is open, close it
          if (Reveal.isOverview()) {
            Reveal.toggleOverview()
          }
        }
      })

      return () => {
        unsubscribe()

        // * Destroy reveal instance, as it creates multiple elements in the DOM
        Reveal.destroy()
      }
    }
  }, [isPresenting, noteId])

  if (!markdown?.length) return

  return (
    <PresenterContainer $isPresenting={isPresenting} className="reveal" ref={presenterRef}>
      <div className="slides">
        {markdown?.split('---')?.map((slideContent, idx) => (
          <section key={idx}>
            {slideContent?.split('+++')?.map((sectionContent, idxN) => (
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
