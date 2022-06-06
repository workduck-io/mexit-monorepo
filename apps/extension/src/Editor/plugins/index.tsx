import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createDndPlugin,
  createHighlightPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createTodoListPlugin,
  createMediaEmbedPlugin,
  createParagraphPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin,
  PlatePlugin,
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  autoformatPunctuation,
  autoformatSmartQuotes,
  ELEMENT_HR,
  createHorizontalRulePlugin,
  setNodes,
  createAlignPlugin,
  ELEMENT_DEFAULT,
  insertNodes,
  createPlugins,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  createPlateUI,
  ELEMENT_PARAGRAPH,
  PlatePluginComponent,
  createTablePlugin
} from '@udecode/plate'

import { createQuickLinkPlugin } from './QuickLink/createQuickLinkPlugin'

import {
  optionsAutoFormatRule,
  optionsCreateNodeIdPlugin,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSelectOnBackspacePlugin,
  optionsSoftBreakPlugin
} from './options'

import { createTagPlugin } from './createTagPlugin'
import { createTodoPlugin } from './createTodoPlugin'

export const generatePlugins = () => {
  const Plugins: PlatePlugin[] = [
    // elements
    createParagraphPlugin(),
    createBlockquotePlugin(),
    createCodeBlockPlugin(),
    createHeadingPlugin(),

    // Marks
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
    createHighlightPlugin(),
    createTodoListPlugin(),

    // Special Elements
    createImagePlugin(),
    createLinkPlugin(),
    createListPlugin(),
    createTablePlugin(),
    createTodoPlugin(),

    // Editing Plugins
    createSoftBreakPlugin(optionsSoftBreakPlugin),
    createExitBreakPlugin(optionsExitBreakPlugin),
    createResetNodePlugin(optionsResetBlockTypePlugin),
    createHorizontalRulePlugin(),
    createSelectOnBackspacePlugin({
      options: { query: { allow: [ELEMENT_HR] } }
    }),
    createAlignPlugin({
      inject: {
        props: {
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6]
        }
      }
    }),

    // Autoformat markdown syntax to elements (**, #(n))
    createAutoformatPlugin({
      options: {
        rules: [
          ...autoformatSmartQuotes,
          ...autoformatPunctuation,
          ...autoformatLegal,
          ...autoformatLegalHtml,
          ...autoformatArrow,
          ...autoformatMath,
          ...optionsAutoFormatRule,
          {
            mode: 'block',
            type: ELEMENT_HR,
            match: ['---', '—-', '___ '],
            format: (editor) => {
              setNodes(editor, { type: ELEMENT_HR })
              insertNodes(editor, {
                type: ELEMENT_DEFAULT,
                children: [{ text: '' }]
              })
            }
          }
        ]
      }
    }),
    createDndPlugin(),
    createMediaEmbedPlugin(),

    // createNodeIdPlugin(optionsCreateNodeIdPlugin),

    // // mex custom plugins
    createTagPlugin(),
    createQuickLinkPlugin(),

    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin)
  ]

  return Plugins
}

const useMemoizedPlugins = (
  plugins: Array<PlatePlugin>,
  components: Record<string, PlatePluginComponent<any | undefined>>
) => {
  return createPlugins(plugins, {
    components: createPlateUI(components)
  })
}

export default useMemoizedPlugins
