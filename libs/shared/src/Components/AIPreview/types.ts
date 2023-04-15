import { MenuListItemType, NodeEditorContent } from '@mexit/core'

export interface AIPreviewProps {
  insertInNote?: boolean
  onInsert?: (content: NodeEditorContent, noteId?: string) => void
  allowReplace?: boolean
  plugins: Array<any>
  root?: HTMLElement
  getDefaultItems?: () => Array<MenuListItemType>
}
