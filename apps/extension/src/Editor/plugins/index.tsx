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
  createMediaEmbedPlugin,
  createNodeIdPlugin,
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
  ELEMENT_PARAGRAPH,
  createTablePlugin,
  parseIframeUrl,
  parseTwitterUrl,
  MediaEmbedTweet,
  parseVideoUrl,
  MediaEmbedVideo
} from '@udecode/plate'

import { ELEMENT_EXCALIDRAW } from '@mexit/core'
import { MediaIFrame, parseRestMediaUrls, TableWrapper } from '@mexit/shared'

import { createQuickLinkPlugin } from './QuickLink'
import { createBlockModifierPlugin } from './createBlockModifierPlugin'
import { createHighlightTextPlugin } from './createHighlightTextPlugin'
import { createTagPlugin } from './createTagPlugin'
import { createTodoPlugin } from './createTodoPlugin'
import {
  optionsAutoFormatRule,
  optionsCreateNodeIdPlugin,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSelectOnBackspacePlugin,
  optionsSoftBreakPlugin
} from './options'
import { optionsImagePlugin } from './options'

export type PluginOptionType = {
  exclude: {
    dnd: boolean
  }
}

/**
 * Plugin generator
 * @param config Configurations for the plugins, event handlers etc.
 * @returns Array of PlatePlugin
 */

export const generatePlugins = (options: PluginOptionType) => {
  const Plugins: PlatePlugin[] = [
    // editor

    // elements
    createParagraphPlugin(), // paragraph element
    createBlockquotePlugin(), // blockquote element
    createCodeBlockPlugin(), // code block element
    createHeadingPlugin(), // heading elements

    // Marks
    createBoldPlugin(), // bold mark
    createItalicPlugin(), // italic mark
    createUnderlinePlugin(), // underline mark
    createStrikethroughPlugin(), // strikethrough mark
    createCodePlugin(), // code mark
    createHighlightPlugin(), // highlight mark
    // createTodoListPlugin(),

    // Special Elements
    createImagePlugin(optionsImagePlugin), // Image
    createLinkPlugin(), // Link
    createListPlugin(), // List
    createTodoPlugin(),
    createTablePlugin({ component: TableWrapper }), // Table

    // Editing Plugins
    createSoftBreakPlugin(optionsSoftBreakPlugin),
    createExitBreakPlugin(optionsExitBreakPlugin),
    createResetNodePlugin(optionsResetBlockTypePlugin),
    createHorizontalRulePlugin(),
    createSelectOnBackspacePlugin({ options: { query: { allow: [ELEMENT_HR, ELEMENT_EXCALIDRAW] } } }),
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
          ...autoformatLegal,
          ...autoformatLegalHtml,
          ...autoformatMath,
          ...autoformatArrow,
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
    createNodeIdPlugin(optionsCreateNodeIdPlugin),
    createBlockModifierPlugin(),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin({
      options: {
        transformUrl: parseIframeUrl,
        rules: [
          // {
          //   parser: parseTwitterUrl,
          //   component: MediaEmbedTweet
          // },
          {
            parser: parseVideoUrl,
            component: MediaEmbedVideo
          },
          {
            parser: parseRestMediaUrls,
            component: MediaIFrame
          }
        ]
      }
    }),

    // Custom Plugins
    // createBlurSelectionPlugin() ,

    // Comboboxes
    createTagPlugin(), // Tags
    createQuickLinkPlugin(), // Internal Links ILinks

    // // For Inline Blocks
    // createInlineBlockPlugin(),

    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin),
    createHighlightTextPlugin()
  ]

  const withPlugins = !options?.exclude?.dnd ? [...Plugins, createDndPlugin()] : Plugins

  return withPlugins
}

const useMemoizedPlugins = (components: Record<string, any>, options?: PluginOptionType) => {
  const wrappedComponents = components

  const plugins = createPlugins(generatePlugins(options), {
    components: wrappedComponents
  })

  return plugins
}

export default useMemoizedPlugins
