/* eslint-disable no-case-declarations */
import React from 'react'

import { deserializeMd, usePlateEditorRef } from '@udecode/plate'

import { mog } from '@mexit/core'
import { ComboSeperator, PreviewMeta } from '@mexit/shared'

import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { usePromptStore } from '../../../Stores/usePromptStore'
import { QuickLinkType } from '../../constants'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'

type ItemPreviewProps = {
  item?: any
  metadata?: any
}

const ItemPreview: React.FC<ItemPreviewProps> = ({ item, metadata }) => {
  const type: QuickLinkType = item?.type
  const preview = useComboboxStore((store) => store.preview)
  const isBlockTriggered = useComboboxStore((store) => store.isBlockTriggered)
  const activeBlock = useComboboxStore((store) => store.activeBlock)
  const { textAfterBlockTrigger } = useComboboxStore((store) => store.search)
  const getPrompt = usePromptStore((s) => s.getPrompt)
  const result = usePromptStore((s) => s.results[item.key])
    ?.at(-1)
    ?.at(0)
  const editor = usePlateEditorRef(item?.key)

  switch (type) {
    case QuickLinkType.prompts:
      const content = deserializeMd(editor, result)
      const prompt = getPrompt(item.key)
      mog('PROMPT IS', { prompt })
      const metadata = {
        updatedAt: prompt.updatedAt
      }

      return (
        <ComboSeperator fixedWidth>
          <section>
            <EditorPreviewRenderer
              noMouseEvents
              content={content}
              readOnly
              draftView
              editorId={isBlockTriggered && activeBlock ? activeBlock?.blockId : `${result}_Preview_Block`}
            />
          </section>
          {metadata && <PreviewMeta meta={metadata} />}
        </ComboSeperator>
      )
  }

  return (
    ((preview && type && !isBlockTriggered) || (isBlockTriggered && textAfterBlockTrigger && preview)) && (
      <ComboSeperator fixedWidth>
        <section>
          <EditorPreviewRenderer
            noMouseEvents
            content={preview?.content || preview}
            readOnly
            draftView
            editorId={isBlockTriggered && activeBlock ? activeBlock?.blockId : `${item?.key}_Preview_Block`}
          />
        </section>
        {preview && <PreviewMeta meta={metadata} />}
      </ComboSeperator>
    )
  )
}

export default ItemPreview
