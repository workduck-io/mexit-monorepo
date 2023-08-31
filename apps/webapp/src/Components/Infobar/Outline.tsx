import React from 'react'

import fileList3Line from '@iconify/icons-ri/file-list-3-line'
import headingIcon from '@iconify/icons-ri/heading'
import listOrdered from '@iconify/icons-ri/list-ordered'
import listUnordered from '@iconify/icons-ri/list-unordered'
import taskLine from '@iconify/icons-ri/task-line'
import { ELEMENT_OL, ELEMENT_UL } from '@udecode/plate'

import { ELEMENT_TODO_LI, ELEMENTS_IN_OUTLINE, useBlockHighlightStore } from '@mexit/core'
import { EntitiesInfo, IconDisplay, InfoWidgetWrapper, Note, OutlineHelp } from '@mexit/shared'

import Collapse from '../../Layout/Collapse'
import { OutlineItem, useAnalysisStore } from '../../Stores/useAnalysis'
import { useFocusBlock } from '../../Stores/useFocusBlock'
import { OutlineIconWrapper, OutlineItemRender, OutlineItemText, OutlineWrapper } from '../../Style/Outline'

interface OutlineProps {
  staticOutline?: OutlineItem[]
  editorId?: string
}

const Outline = ({ staticOutline, editorId }: OutlineProps) => {
  const storeOutline = useAnalysisStore((state) => state.analysis?.outline)

  const outline = staticOutline ? staticOutline : storeOutline

  const { selectBlock } = useFocusBlock()
  const setHighlights = useBlockHighlightStore((state) => state.setHighlightedBlockIds)

  return (
    <InfoWidgetWrapper>
      <Collapse
        maximumHeight="40vh"
        defaultOpen
        icon={fileList3Line}
        title="Outline"
        infoProps={{
          text: OutlineHelp
        }}
      >
        {outline?.length > 0 ? (
          <OutlineWrapper>
            {outline.map((outlineItem) => {
              const icon = EntitiesInfo[outlineItem.type]?.icon
              const isHeading = ELEMENTS_IN_OUTLINE.includes(outlineItem?.type?.toLowerCase())

              return (
                <OutlineItemRender
                  key={`OutlineItemFor_${outlineItem.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setHighlights([outlineItem.id], 'editor')
                    selectBlock(outlineItem.id, editorId)
                  }}
                  level={outlineItem.level}
                  heading={isHeading}
                >
                  <OutlineIconWrapper>
                    {isHeading ? outlineItem.type.toUpperCase() : <IconDisplay icon={icon} />}
                  </OutlineIconWrapper>
                  <OutlineItemText level={outlineItem.level} heading={isHeading}>
                    {outlineItem.title}
                  </OutlineItemText>
                </OutlineItemRender>
              )
            })}
          </OutlineWrapper>
        ) : (
          <>
            <Note>No Outline found.</Note>
            <Note>Create headings with h1, h2, h3 etc to generate outline.</Note>
          </>
        )}
      </Collapse>
    </InfoWidgetWrapper>
  )
}

const getOutlineIcon = (type: string) => {
  if (ELEMENTS_IN_OUTLINE.includes(type.toLowerCase())) {
    return headingIcon
  }

  if (type === ELEMENT_TODO_LI) {
    return taskLine
  }

  if (type === ELEMENT_OL) {
    return listOrdered
  }

  if (type === ELEMENT_UL) {
    return listUnordered
  }
}

export default Outline
