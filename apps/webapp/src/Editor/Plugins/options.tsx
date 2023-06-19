import {
  autoformatComparison,
  autoformatEquality,
  autoformatFraction,
  AutoformatQueryOptions,
  AutoformatRule,
  autoformatSubscriptNumbers,
  autoformatSubscriptSymbols,
  autoformatSuperscriptNumbers,
  autoformatSuperscriptSymbols,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_DEFAULT,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_IMAGE,
  ELEMENT_LI,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TD,
  ELEMENT_TODO_LI,
  getParentNode,
  getPluginType,
  insertEmptyCodeBlock,
  insertNodes,
  isBlockAboveEmpty,
  isElement,
  isSelectionAtBlockStart,
  isType,
  KEYS_HEADING,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  PlateEditor,
  setElements,
  toggleList,
  unwrapList,
  Value
} from '@udecode/plate'

import {
  ELEMENT_INLINE_BLOCK,
  ELEMENT_SECTION_SEPARATOR,
  ELEMENT_SYNC_BLOCK,
  ELEMENT_TASK_VIEW_BLOCK,
  generateTempId,
  getDefaultContent,
  SECTION_SEPARATOR,
  TodoStatus
} from '@mexit/core'

const preFormat = (editor: PlateEditor<Value>) => unwrapList(editor)

/*
 * Returns true if the autoformat can be applied:
 * Is outside of code
 */
export const formatQuery = (editor: PlateEditor<Value>, options: AutoformatQueryOptions) => {
  const parentEntry = getParentNode(editor, editor.selection.focus)
  if (!parentEntry) return

  const [node] = parentEntry

  if (isElement(node) && node.type !== ELEMENT_CODE_LINE && node.type !== ELEMENT_CODE_BLOCK) {
    return true
  }

  return false
}

export const optionsAutoFormatRule: Array<AutoformatRule> = [
  {
    mode: 'block',
    type: ELEMENT_H1,
    match: ['h1', 'H1'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H2,
    match: ['h2', 'H2'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H3,
    match: ['h3', 'H3'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_SECTION_SEPARATOR,
    match: [SECTION_SEPARATOR],
    triggerAtBlockStart: true,
    query: formatQuery,
    format: (editor: PlateEditor<Value>) => {
      const content = [getDefaultContent(ELEMENT_SECTION_SEPARATOR), getDefaultContent()]
      insertNodes(editor, content)
    }
  },
  {
    mode: 'block',
    type: ELEMENT_H4,
    match: ['h4', 'H4'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H5,
    match: ['h5', 'H5'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_H6,
    match: ['h6', 'H6'],
    query: formatQuery,
    preFormat
  },
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['* ', '- '],
    triggerAtBlockStart: false,
    query: formatQuery,
    // preFormat,
    format: (editor: PlateEditor<Value>) => {
      if (editor.selection) {
        const parentEntry = getParentNode(editor, editor.selection)
        if (!parentEntry) return

        const [node] = parentEntry

        if (isElement(node) && !isType(editor, node, ELEMENT_CODE_BLOCK) && !isType(editor, node, ELEMENT_CODE_LINE)) {
          const content = [
            {
              type: 'ul',
              id: generateTempId(),
              children: [
                {
                  type: 'li',
                  children: [
                    {
                      type: 'lic',
                      children: [
                        {
                          type: 'p',
                          text: ''
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]

          insertNodes(editor, content)
        }
      }
    }
  },
  {
    mode: 'block',
    type: ELEMENT_LI,
    match: ['1.', '1)'],
    preFormat,
    query: formatQuery,
    format: (editor: PlateEditor<Value>) => {
      if (editor.selection) {
        const parentEntry = getParentNode(editor, editor.selection)
        if (!parentEntry) return
        const [node] = parentEntry
        if (isElement(node) && !isType(editor, node, ELEMENT_CODE_BLOCK) && !isType(editor, node, ELEMENT_CODE_LINE)) {
          toggleList(editor, {
            type: ELEMENT_OL
          })
        }
      }
    }
  },
  {
    mode: 'block',
    type: ELEMENT_TODO_LI,
    match: '[]',
    triggerAtBlockStart: false,
    format: (editor: PlateEditor<Value>) => {
      setElements(editor, {
        type: ELEMENT_TODO_LI,
        status: TodoStatus.todo
      })
    },
    query: formatQuery
  },
  {
    mode: 'block',
    type: ELEMENT_BLOCKQUOTE,
    match: ['>'],
    query: formatQuery,
    preFormat
  },
  {
    type: MARK_BOLD,
    match: ['**', '**'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_BOLD,
    match: ['__', '__'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_ITALIC,
    match: ['*', '*'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_ITALIC,
    match: ['_', '_'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_CODE,
    match: ['`', '`'],
    mode: 'mark',
    query: formatQuery
  },
  {
    type: MARK_STRIKETHROUGH,
    match: ['~~', '~~'],
    mode: 'mark',
    query: formatQuery
  },
  {
    mode: 'block',
    type: ELEMENT_CODE_BLOCK,
    match: '``',
    trigger: '`',
    triggerAtBlockStart: false,
    format: (editor: PlateEditor<Value>) => {
      insertEmptyCodeBlock(editor, {
        defaultType: getPluginType(editor, ELEMENT_DEFAULT),
        insertNodesOptions: { select: true }
      })
    }
  }
]

export const optionsSoftBreakPlugin = {
  options: {
    rules: [
      { hotkey: 'shift+enter' },
      {
        hotkey: 'enter',
        query: {
          allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD]
        }
      }
    ]
  }
}

export const autoformatMath: AutoformatRule[] = [
  ...autoformatComparison,
  ...autoformatEquality,
  ...autoformatFraction,
  {
    mode: 'text',
    match: '+-',
    format: '±'
  },
  {
    mode: 'text',
    match: '%%',
    format: '‰'
  },
  {
    mode: 'text',
    match: ['%%%', '‰%'],
    format: '‱'
  },
  ...autoformatSuperscriptSymbols,
  ...autoformatSubscriptSymbols,
  ...autoformatSuperscriptNumbers,
  ...autoformatSubscriptNumbers
]

export const optionsExitBreakPlugin = {
  options: {
    rules: [
      {
        hotkey: 'mod+enter'
      },
      {
        hotkey: 'mod+shift+enter',
        before: true
      },
      {
        hotkey: 'enter',
        query: {
          start: true,
          end: true,
          allow: KEYS_HEADING
        }
      }
    ]
  }
}

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE],
  defaultType: ELEMENT_PARAGRAPH
}

export const optionsResetBlockTypePlugin = {
  options: {
    rules: [
      {
        ...resetBlockTypesCommonRule,
        hotkey: 'Enter',
        predicate: isBlockAboveEmpty
      },
      {
        ...resetBlockTypesCommonRule,
        hotkey: 'Backspace',
        predicate: isSelectionAtBlockStart
      }
    ]
  }
}

export const optionsSelectOnBackspacePlugin = {
  options: { query: { allow: [ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED, ELEMENT_INLINE_BLOCK, ELEMENT_TASK_VIEW_BLOCK] } }
}

export const optionsCreateNodeIdPlugin = {
  options: {
    reuseId: true,
    filterText: false,
    idCreator: () => generateTempId(),
    exclude: [ELEMENT_SYNC_BLOCK]
  }
}
