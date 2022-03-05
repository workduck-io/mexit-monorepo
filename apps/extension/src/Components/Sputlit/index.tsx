import { usePlateEditorRef } from '@udecode/plate'
import { nanoid } from 'nanoid'
import React, { useEffect, useMemo, useState } from 'react'
import { NodeEditorContent } from '@mexit/shared'
import HighlightSource from 'web-highlighter/dist/model/source'

import { useContentStore } from '../../Hooks/useContentStore'
import { getMexHTMLDeserializer } from '../../Utils/deserialize'
import { Editor } from '../Editor'
import Search from '../Search'
import Content from '../Content'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { Main, Overlay, Wrapper } from './styled'

const Sputlit = ({
  url,
  html,
  range,
  editContent
}: {
  url?: string
  html?: string
  range?: Partial<HighlightSource>
  editContent?: NodeEditorContent
}) => {
  const setVisualState = useSputlitContext().setVisualState
  return (
    <div id="sputlit-container">
      <Wrapper>
        <Main>
          <Search />
          <Content url={url} html={html} range={range} editContent={editContent} />
        </Main>
      </Wrapper>
      <Overlay
        id="sputlit-overlay"
        onClick={() => {
          setVisualState(VisualState.hidden)
        }}
      />
    </div>
  )
}

export default Sputlit
