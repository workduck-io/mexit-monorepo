import React, { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { transparentize } from 'polished'
import { Editor } from 'slate'
import { ReactEditor, useFocused, useSelected } from 'slate-react'
import { createNodesHOC, isCollapsed, useEditorState } from '@udecode/plate-core'

import { BlockType } from '@mexit/core'

import Block from './Block'
import { BlockOptionProps } from '../../Types/Block'
import useBlockStore from '../../../Stores/useBlockStore'

const BlockOptions = (props: BlockOptionProps) => {
  const { children, element } = props

  const isBlockMode = useBlockStore((store) => store.isBlockMode)

  const theme = useTheme()
  const focused = useFocused()
  const selected = useSelected()
  const editor = useEditorState()

  const elementStyles = {
    borderRadius: theme.borderRadius.tiny,
    margin: '4px 0',
    backgroundColor:
      selected && !isCollapsed(editor.selection) && focused && transparentize(0.05, theme.colors.background.highlight)
  }

  const path = useMemo(() => element && ReactEditor.findPath(editor, element), [editor, element])
  const isBlock = path?.length === 1

  if (!element || !isBlockMode || !isBlock)
    return React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        style: elementStyles,
        className: child.props.className,
        nodeProps: {
          ...props.nodeProps
        }
      })
    })

  const isEmptyBlock = Editor.isEmpty(editor, element)

  return (
    <Block isBlock={isBlock} isEmpty={isEmptyBlock} blockId={element?.id} block={element as BlockType}>
      {children}
    </Block>
  )
}

export const withBlockOptions = createNodesHOC(BlockOptions)
