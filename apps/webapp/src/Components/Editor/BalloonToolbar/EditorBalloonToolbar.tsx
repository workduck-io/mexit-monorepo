import AlignLeftIcon from '@iconify/icons-bx/bx-align-left'
import AlignCenterIcon from '@iconify/icons-bx/bx-align-middle'
import AlignRightIcon from '@iconify/icons-bx/bx-align-right'
import addLine from '@iconify/icons-ri/add-line'
import boldIcon from '@iconify/icons-ri/bold'
import codeLine from '@iconify/icons-ri/code-line'
import doubleQuotesL from '@iconify/icons-ri/double-quotes-l'
import fileAddLine from '@iconify/icons-ri/file-add-line'
import h1 from '@iconify/icons-ri/h-1'
import h2 from '@iconify/icons-ri/h-2'
import h3 from '@iconify/icons-ri/h-3'
import italicIcon from '@iconify/icons-ri/italic'
import listOrdered from '@iconify/icons-ri/list-ordered'
import listUnordered from '@iconify/icons-ri/list-unordered'
import strikeThrough from '@iconify/icons-ri/strikethrough'

import { Icon } from '@iconify/react'
import { ButtonSeparator } from '@mexit/shared'
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
  MarkToolbarButton,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  ToolbarButtonProps,
  usePlateEditorRef
} from '@udecode/plate'
import React from 'react'
import { BalloonToolbar } from './BalloonToolbar'
import { SelectionToNode } from './components/SelectionToNode'
import { SelectionToSnippet } from './components/SelectionToSnippet'

const BallonMarkToolbarButtons = () => {
  const editor = usePlateEditorRef()

  const arrow = false
  const theme = 'dark'
  const top = 'top' as const
  const popperOptions = {
    placement: top
  }
  const tooltip = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    theme: 'mex',
    hideOnClick: false,
    offset: [0, 17],
    placement: top
  } as any

  return (
    <BalloonToolbar popperOptions={popperOptions} theme={theme} arrow={arrow}>
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H1)}
        icon={<Icon height={20} icon={h1} />}
        tooltip={{ content: 'Heading 1', ...tooltip }}
      />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H2)}
        icon={<Icon height={20} icon={h2} />}
        tooltip={{ content: 'Heading 2', ...tooltip }}
      />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H3)}
        icon={<Icon height={20} icon={h3} />}
        tooltip={{ content: 'Heading 3', ...tooltip }}
      />
      <ButtonSeparator />

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

      <ButtonSeparator />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<Icon height={20} icon={doubleQuotesL} />}
        tooltip={{ content: 'Quote', ...tooltip }}
      />

      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_UL)}
        icon={<Icon height={20} icon={listUnordered} />}
        tooltip={{ content: 'Bullet List', ...tooltip }}
      />

      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_OL)}
        icon={<Icon height={20} icon={listOrdered} />}
        tooltip={{ content: 'Ordered List', ...tooltip }}
      />

      <ButtonSeparator />

      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<Icon height={20} icon={boldIcon} />}
        tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<Icon height={20} icon={strikeThrough} />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<Icon height={20} icon={italicIcon} />}
        tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <MarkToolbarButton type={getPluginType(editor, MARK_CODE)} icon={<Icon height={20} icon={codeLine} />} />

      <ButtonSeparator />

      <SelectionToNode
        icon={<Icon height={20} icon={addLine} />}
        tooltip={{ content: 'Convert Blocks to New Node', ...tooltip }}
      />

      <SelectionToSnippet
        icon={<Icon height={20} icon={fileAddLine} />}
        tooltip={{ content: 'Convert Blocks to New Snippet', ...tooltip }}
      />
      {/* <ButtonSeparator />
      <LinkButton tooltip={{ content: 'Link', ...tooltip }} icon={<Icon height={20} icon={linkIcon} />} /> */}
      {/* Looses focus when used. */}
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
