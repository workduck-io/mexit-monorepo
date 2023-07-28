/* eslint-disable no-case-declarations */
import React from 'react'

import { useComboboxStore } from '@mexit/core'
import { ComboSeperator, PreviewMeta } from '@mexit/shared'

import { QuickLinkType } from '../../constants'
import EditorPreviewRenderer from '../../EditorPreviewRenderer'

import PromptPreview from './Preview/Prompts'

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

  switch (type) {
    case QuickLinkType.prompts:
      return <PromptPreview promptId={item.key} />
  }

  return (
    ((preview && type && !isBlockTriggered) || (isBlockTriggered && textAfterBlockTrigger && preview)) && (
      <ComboSeperator fixedWidth>
        <section>
          <EditorPreviewRenderer
            noStyle
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
