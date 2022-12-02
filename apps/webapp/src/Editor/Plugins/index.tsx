import {
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  autoformatSmartQuotes,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createDndPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHighlightPlugin,
  createHorizontalRulePlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createPlugins,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTablePlugin,
  createUnderlinePlugin,
  ELEMENT_DEFAULT,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_HR,
  ELEMENT_PARAGRAPH,
  insertNodes,
  MediaEmbedTweet,
  MediaEmbedVideo,
  parseIframeUrl,
  parseVideoUrl,
  PlatePlugin,
  setNodes} from '@udecode/plate'

import { useAuth } from '@workduck-io/dwindle'

import { ELEMENT_EXCALIDRAW } from '@mexit/core'
import { MediaIFrame, parseRestMediaUrls, TableWrapper, useUploadToCDN } from '@mexit/shared'

import { withStyledDraggables } from '../Actions/withDraggables'
import { withStyledPlaceHolders } from '../Actions/withPlaceholder'
import { withBlockOptions } from '../Components/Blocks'
import { PlateFloatingLink } from '../Components/FloatingLink'

import { createBlockModifierPlugin } from './createBlockModifierPlugin'
import { createBlurSelectionPlugin } from './createBlurSelection'
import { createHighlightTextPlugin } from './createHighlightTextPlugin'
import { createILinkPlugin } from './createILinkPlugin'
import { createInlineBlockPlugin } from './createInlineBlockPlugin'
import { createMentionPlugin } from './createMentionsPlugin'
import { createTagPlugin } from './createTagPlugin'
import { createTaskViewLinkPlugin } from './createTaskViewLinkPlugin'
import { createTodoPlugin } from './createTodoPlugin'
import {
  optionsAutoFormatRule,
  optionsCreateNodeIdPlugin,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSelectOnBackspacePlugin,
  optionsSoftBreakPlugin
} from './options'
import { parseTwitterUrl } from './parseTwitterUrl'

export type PluginOptionType = {
  exclude?: {
    dnd?: boolean
    mentions?: boolean
  }
  include?: {
    blockModifier?: boolean
  }
  uploadImage?: (data: string | ArrayBuffer) => Promise<string | ArrayBuffer>
}

export const linkPlugin = {
  renderAfterEditable: PlateFloatingLink
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
    createImagePlugin({
      options: {
        uploadImage: options.uploadImage
      }
    }),
    createLinkPlugin(linkPlugin), // Link
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

    // Shows share link, comments and reactions attached to the block
    options?.include?.blockModifier !== true ? undefined : createBlockModifierPlugin(),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin({
      options: {
        transformUrl: parseIframeUrl,
        rules: [
          {
            parser: parseTwitterUrl,
            component: MediaEmbedTweet
          },
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
    createBlurSelectionPlugin(),

    // Comboboxes
    createTagPlugin(), // Tags
    createILinkPlugin(), // Internal Links ILinks

    // // For Inline Blocks
    createInlineBlockPlugin(),

    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin),
    createHighlightTextPlugin(),

    createMentionPlugin(), // Mentions

    createTaskViewLinkPlugin() // Task View Links
  ].filter((p) => p !== undefined)

  const withPlugins = !options?.exclude?.dnd ? [...Plugins, createDndPlugin()] : Plugins

  return withPlugins
}

export const generateEditorPluginsWithComponents = (components: Record<string, any>, options?: PluginOptionType) => {
  const wrappedComponents = options?.exclude?.dnd
    ? components
    : withStyledDraggables(withStyledPlaceHolders(withBlockOptions(components, {})))

  const plugins = createPlugins(generatePlugins(options), {
    components: wrappedComponents
  })

  return plugins
}

export const useEditorPlugins = (components: Record<string, any>, options?: PluginOptionType) => {
  const { uploadImageToS3 } = useAuth()
  const { uploadImageToWDCDN } = useUploadToCDN(uploadImageToS3)

  const wrappedComponents = options?.exclude?.dnd
    ? components
    : withStyledDraggables(withStyledPlaceHolders(withBlockOptions(components, {})))

  const plugins = createPlugins(
    generatePlugins({
      ...options,
      uploadImage: options.uploadImage ?? uploadImageToWDCDN
    }),
    {
      components: wrappedComponents
    }
  )

  return plugins
}
