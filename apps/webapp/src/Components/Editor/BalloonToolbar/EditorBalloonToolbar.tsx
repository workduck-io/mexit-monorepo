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
  ToolbarButtonProps,
  usePlateEditorRef
} from '@udecode/plate'
import { useTheme } from 'styled-components'

import {
  ButtonSeparator,
  DefaultMIcons,
  GenericFlex,
  getMIcon,
  IconDisplay,
  useBalloonToolbarStore
} from '@mexit/shared'

import { useCreateNewMenu } from '../../../Hooks/useCreateNewMenu'

import { SelectionToNode, SelectionToNodeInput } from './components/SelectionToNode'
import { SelectionToSnippet, SelectionToSnippetInput } from './components/SelectionToSnippet'
import { SelectionToTask } from './components/SelectionToTask'
import BallonOptionsUnwrapper from './BallonOptionsUnwrapper'
import { BalloonToolbar } from './BalloonToolbar'

const BallonMarkToolbarButtons = () => {
  const [isOptionOpen, setIsOptionOpen] = React.useState<string | null>(null)

  const toolbarState = useBalloonToolbarStore((s) => s.toolbarState)
  const theme = useTheme()
  const editor = usePlateEditorRef()
  const { getAIMenuItems } = useCreateNewMenu()

  const handleOpenOption = (id: string) => {
    setIsOptionOpen(id)
  }

  const arrow = false
  const top = 'top' as const

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
    <BalloonToolbar floatingOptions={floatingOptions} arrow={arrow}>
      {
        {
          normal: (
            <>
              <BallonOptionsUnwrapper
                id="headings"
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
                id="align-items"
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
                id="block-modifiers"
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
                id="font-modifiers"
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

              <ButtonSeparator />

              <GenericFlex>
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
              </GenericFlex>
              <ButtonSeparator />

              <BallonOptionsUnwrapper
                id="ai-actions"
                icon={DefaultMIcons.AI}
                color={theme.tokens.colors.primary.default}
                active={isOptionOpen}
                onClick={handleOpenOption}
              >
                {getAIMenuItems().map((item) => (
                  <Icon key={item.id} onClick={item.onSelect} height={20} icon={item.icon.value} />
                ))}
              </BallonOptionsUnwrapper>
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
