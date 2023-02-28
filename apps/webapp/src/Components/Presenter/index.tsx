import 'reveal.js/dist/reveal.css'

import { useEffect, useRef, useState } from 'react'

import { getPlateEditorRef } from '@udecode/plate'
import Markdown from 'markdown-to-jsx'
import Reveal from 'reveal.js'

import { tinykeys } from '@workduck-io/tinykeys'

import { ELEMENT_PARAGRAPH } from '@mexit/core'

import parseToMarkdown from '../../Editor/utils'
import { useEditorStore } from '../../Stores/useEditorStore'

import { PresenterContainer } from './styled'

const Presenter = () => {
  const [markdown, setMarkdown] = useState('')
  const presenterRef = useRef<HTMLDivElement>(null)

  const isPresenting = true
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
    const editor = getPlateEditorRef()
    if (editor?.children) {
      const markdownContent = parseToMarkdown({ children: editor.children, type: ELEMENT_PARAGRAPH })
      setMarkdown(markdownContent)
      // goFullScreen(presenterRef.current)
    }
  }

  useEffect(() => {
    if (isPresenting) {
      Reveal.initialize({ controlsLayout: 'edges' })
      setMarkdownFromEditor()

      const unsubscribe = tinykeys(window, {
        Escape: () => {
          setIsPresenting(false)
        }
      })

      return () => unsubscribe()
    }
  }, [isPresenting])

  if (!isPresenting) return

  return (
    <PresenterContainer ref={presenterRef} className="reveal">
      <div className="slides">
        <section>
          {markdown?.split('---').map((s) => (
            <Markdown>{s}</Markdown>
          ))}
        </section>
        <section>Hello</section>
      </div>
    </PresenterContainer>
  )
}

export default Presenter
