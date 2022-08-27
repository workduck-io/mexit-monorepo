import React from 'react'

import { Icon } from '@iconify/react'
import {
  usePlateEditorRef,
  getPluginType,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  BalloonToolbar,
  MarkToolbarButton,
  AlignToolbarButton,
  BlockToolbarButton,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_OL,
  ELEMENT_UL,
  ListToolbarButton
} from '@udecode/plate'

import { Separator } from './Seperator'

const IconButton = ({ icon }: { icon: string }) => <Icon icon={icon} height={24} />

const Toolbar = () => {
  const editor = usePlateEditorRef()
  const theme = 'dark'
  const arrow = false

  return (
    <BalloonToolbar theme={theme} arrow={arrow}>
      <MarkToolbarButton type={getPluginType(editor, MARK_BOLD)} icon={<Icon icon="ri:bold" height={24} />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_ITALIC)} icon={<Icon icon="ri:italic" height={24} />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_UNDERLINE)} icon={<Icon icon="ri:underline" height={24} />} />

      <Separator />

      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H1)} icon={<Icon icon="ri:h-1" />} height={24} />

      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H2)} icon={<Icon icon="ri:h-2" />} height={24} />

      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H3)} icon={<Icon icon="ri:h-3" />} height={24} />

      <Separator />

      <AlignToolbarButton value="left" icon={<Icon icon="bx:bx-align-left" />} height={24} />
      <AlignToolbarButton value="center" icon={<Icon icon="bx:bx-align-middle" />} height={24} />
      <AlignToolbarButton value="right" icon={<Icon icon="bx:bx-align-right" />} height={24} />
    </BalloonToolbar>
  )
}

export default Toolbar
