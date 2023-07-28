import React from 'react'

import AlignLeftIcon from '@iconify/icons-bx/bx-align-left'
import AlignCenterIcon from '@iconify/icons-bx/bx-align-middle'
import AlignRightIcon from '@iconify/icons-bx/bx-align-right'
import boldIcon from '@iconify/icons-ri/bold'
import codeLine from '@iconify/icons-ri/code-line'
import doubleQuotesL from '@iconify/icons-ri/double-quotes-l'
import h1 from '@iconify/icons-ri/h-1'
import h2 from '@iconify/icons-ri/h-2'
import h3 from '@iconify/icons-ri/h-3'
import italicIcon from '@iconify/icons-ri/italic'
import listOrdered from '@iconify/icons-ri/list-ordered'
import listUnordered from '@iconify/icons-ri/list-unordered'
import strikeThrough from '@iconify/icons-ri/strikethrough-2'
import underlineIcon from '@iconify/icons-ri/underline'
import { Icon } from '@iconify/react'
import {
  AlignToolbarButton,
  BlockToolbarButton,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_OL,
  ELEMENT_UL,
  getPluginType,
  ListToolbarButton,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  MarkToolbarButton,
  ToolbarButton,
  ToolbarButtonProps,
  useEditorState,
  usePlateEditorRef
} from '@udecode/plate'
import { useTheme } from 'styled-components'
import Highlighter from 'web-highlighter'

import { FloatingElementType, useFloatingStore, useHistoryStore } from '@mexit/core'
import {
  BallonOptionsUnwrapper,
  BalloonToolbar,
  ButtonSeparator,
  DefaultMIcons,
  IconDisplay,
  useBalloonToolbarStore
} from '@mexit/shared'

import useUpdateBlock from '../../../Editor/Hooks/useUpdateBlock'

import { SelectionToNodeInput } from './components/SelectionToNode'
import { SelectionToSnippetInput } from './components/SelectionToSnippet'

const BallonMarkToolbarButtons = () => {
  const [isOptionOpen, setIsOptionOpen] = React.useState<string | null>(null)

  const theme = useTheme()
  const editor = usePlateEditorRef()
  const { getSelectionInMarkdown } = useUpdateBlock()
  const addAIEvent = useHistoryStore((store) => store.addInitialEvent)
  const toolbarState = useBalloonToolbarStore((s) => s.toolbarState)
  const setFloatingElement = useFloatingStore((s) => s.setFloatingElement)

  const handleOpenOption = (id: string) => {
    setIsOptionOpen(id)
  }

  const handleOpenAIPreview = (event) => {
    event.preventDefault()

    const content = getSelectionInMarkdown()
    const selection = window.getSelection()

    if (content) {
      addAIEvent({ role: 'assistant', content })
    }

    const highlight = new Highlighter({
      style: {
        className: 'mexit-highlight'
      }
    })

    const range = selection.getRangeAt(0)
    const id = highlight.fromRange(range)?.id

    setFloatingElement(FloatingElementType.AI_POPOVER, {
      range,
      id
    })
  }

  const arrow = false
  const top = 'top' as const

  const floatingEditor = useEditorState()

  const floatingOptions = {
    placement: top
  }

  const tooltip = {
    arrow: true,
    duration: [200, 0],
    delay: 500,
    theme: 'mex',
    hideOnClick: false,
    offset: [0, 10],
    placement: top
  } as any

  return (
    <BalloonToolbar floatingOptions={floatingOptions} arrow={arrow} editor={floatingEditor}>
      {
        {
          normal: (
            <>
              <ToolbarButton
                tooltip={{ content: 'Ask AI anything...', ...tooltip }}
                icon={<IconDisplay color={theme.tokens.colors.primary.hover} size={20} icon={DefaultMIcons.AI} />}
                onMouseDown={handleOpenAIPreview}
              />
              <ButtonSeparator />
              <BallonOptionsUnwrapper
                id="Headings"
                icon={DefaultMIcons.ADD}
                active={isOptionOpen}
                onClick={handleOpenOption}
              >
                <BlockToolbarButton
                  type={getPluginType(editor, ELEMENT_H1)}
                  icon={<Icon height={16} icon={h1} />}
                  tooltip={{ content: 'Heading 1', ...tooltip }}
                />

                <BlockToolbarButton
                  type={getPluginType(editor, ELEMENT_H2)}
                  icon={<Icon height={16} icon={h2} />}
                  tooltip={{ content: 'Heading 2', ...tooltip }}
                />

                <BlockToolbarButton
                  type={getPluginType(editor, ELEMENT_H3)}
                  icon={<Icon height={16} icon={h3} />}
                  tooltip={{ content: 'Heading 3', ...tooltip }}
                />
              </BallonOptionsUnwrapper>
              <ButtonSeparator />

              <BallonOptionsUnwrapper
                id="Alignment Modifiers"
                icon={DefaultMIcons.ADD}
                active={isOptionOpen}
                onClick={handleOpenOption}
              >
                <AlignToolbarButton
                  value="left"
                  tooltip={{ content: 'Align Left', ...tooltip }}
                  icon={<Icon icon={AlignLeftIcon} />}
                />
                <AlignToolbarButton
                  value="center"
                  tooltip={{ content: 'Align Center', ...tooltip }}
                  icon={<Icon icon={AlignCenterIcon} />}
                />
                <AlignToolbarButton
                  value="right"
                  tooltip={{ content: 'Align Right', ...tooltip }}
                  icon={<Icon icon={AlignRightIcon} />}
                />
              </BallonOptionsUnwrapper>

              <ButtonSeparator />

              <BallonOptionsUnwrapper
                id="Block Modifiers"
                icon={DefaultMIcons.ADD}
                active={isOptionOpen}
                onClick={handleOpenOption}
              >
                <BlockToolbarButton
                  type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
                  icon={<Icon height={16} icon={doubleQuotesL} />}
                  tooltip={{ content: 'Quote', ...tooltip }}
                />

                <ListToolbarButton
                  type={getPluginType(editor, ELEMENT_UL)}
                  icon={<Icon height={16} icon={listUnordered} />}
                  tooltip={{ content: 'Bullet List', ...tooltip }}
                />

                <ListToolbarButton
                  type={getPluginType(editor, ELEMENT_OL)}
                  icon={<Icon height={16} icon={listOrdered} />}
                  tooltip={{ content: 'Ordered List', ...tooltip }}
                />
              </BallonOptionsUnwrapper>

              <ButtonSeparator />

              <BallonOptionsUnwrapper
                id="Font Modifiers"
                icon={DefaultMIcons.ADD}
                active={isOptionOpen}
                onClick={handleOpenOption}
              >
                <MarkToolbarButton
                  type={getPluginType(editor, MARK_BOLD)}
                  icon={<Icon height={16} icon={boldIcon} />}
                  tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
                />
                <MarkToolbarButton
                  type={getPluginType(editor, MARK_STRIKETHROUGH)}
                  icon={<Icon height={16} icon={strikeThrough} />}
                  tooltip={{ content: 'Strike through ⌘⇧X', ...tooltip }}
                />
                <MarkToolbarButton
                  type={getPluginType(editor, MARK_ITALIC)}
                  icon={<Icon height={16} icon={italicIcon} />}
                  tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
                />
                <MarkToolbarButton
                  type={getPluginType(editor, MARK_UNDERLINE)}
                  icon={<Icon height={16} icon={underlineIcon} />}
                  tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
                />
                <MarkToolbarButton
                  type={getPluginType(editor, MARK_CODE)}
                  icon={<Icon height={16} icon={codeLine} />}
                />
              </BallonOptionsUnwrapper>

              {/* <ButtonSeparator /> */}

              {/* <BallonOptionsUnwrapper
                id="Create New"
                icon={DefaultMIcons.ADD}
                active={isOptionOpen}
                onClick={handleOpenOption}
              >
                <SelectionToTask
                  icon={<IconDisplay size={16} icon={getMIcon('ICON', 'mex:task-progress')} />}
                  tooltip={{ content: 'Convert to Task', ...tooltip }}
                />

                <SelectionToNode
                  icon={<IconDisplay size={20} icon={DefaultMIcons.NOTE} />}
                  tooltip={{ content: 'Convert to Note', ...tooltip }}
                />

                <SelectionToSnippet
                  icon={<IconDisplay size={20} icon={DefaultMIcons.SNIPPET} />}
                  tooltip={{ content: 'Convert to Snippet', ...tooltip }}
                />
              </BallonOptionsUnwrapper> */}
            </>
          ),
          'new-note': <SelectionToNodeInput />,
          'new-snippet': <SelectionToSnippetInput />
        }[toolbarState]
      }
    </BalloonToolbar>
  )
}

export interface LinkToolbarButtonProps extends ToolbarButtonProps {
  /**
   * Default onMouseDown is getting the link url by calling this promise before inserting the image.
   */
  getLinkUrl?: (prevUrl: string | null) => Promise<string | null>
}

export default BallonMarkToolbarButtons
