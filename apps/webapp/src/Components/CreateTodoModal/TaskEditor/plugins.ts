import {
  createBoldPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createPlateUI,
  createPlugins,
  createSelectOnBackspacePlugin,
  createSingleLinePlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  LinkElement,
  MediaEmbedTweet,
  MediaEmbedVideo,
  parseIframeUrl,
  parseVideoUrl,
  StyledElement,
  withProps} from '@udecode/plate'
import { createHighlightPlugin } from '@udecode/plate-highlight'

import { ELEMENT_ILINK, ELEMENT_TAG, ELEMENT_TODO_LI } from '@mexit/core'
import {
  createBlurSelectionPlugin,
  MediaEmbedElement,
  MediaIFrame,
  parseRestMediaUrls,
  UploadImageFn
} from '@mexit/shared'

import { MentionElement } from '../../../Editor/Components/Mentions/MentionElement'
import { QuickLinkElement } from '../../../Editor/Components/QuickLink/QuickLinkElement'
import TagElement from '../../../Editor/Components/Tags/TagElement'
import { createBlockModifierPlugin } from '../../../Editor/Plugins/createBlockModifierPlugin'
import { createILinkPlugin } from '../../../Editor/Plugins/createILinkPlugin'
import { createInlineBlockPlugin } from '../../../Editor/Plugins/createInlineBlockPlugin'
import { createMentionPlugin } from '../../../Editor/Plugins/createMentionsPlugin'
import { createTagPlugin } from '../../../Editor/Plugins/createTagPlugin'
import { createTodoPlugin } from '../../../Editor/Plugins/createTodoPlugin'
import { optionsCreateNodeIdPlugin, optionsSelectOnBackspacePlugin } from '../../../Editor/Plugins/options'
import { parseTwitterUrl } from '../../../Editor/Plugins/parseTwitterUrl'
import Todo from '../../Todo'

const generateTodoPlugins = (uploadImage?: UploadImageFn) => {
  return [
    // elements
    createParagraphPlugin(), // paragraph element

    createSelectOnBackspacePlugin(),
    createImagePlugin({
      options: {
        uploadImage
      }
    }), // Image
    createLinkPlugin(), // Link

    // Marks
    createBoldPlugin(), // bold mark
    createItalicPlugin(), // italic mark
    createUnderlinePlugin(), // underline mark
    createStrikethroughPlugin(), // strikethrough mark
    createHighlightPlugin(), // highlight mark
    // createTodoListPlugin(),
    createNodeIdPlugin(optionsCreateNodeIdPlugin),
    createBlockModifierPlugin(),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin({
      isInline: true,
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
    createTodoPlugin(),
    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin),

    // Comboboxes
    createTagPlugin(), // Tags
    createMentionPlugin(), // Mentions
    createILinkPlugin(), // Internal Links ILinks
    createInlineBlockPlugin(),
    createSingleLinePlugin()
  ]
}

export const getComponents = () =>
  createPlateUI({
    [ELEMENT_LINK]: withProps(LinkElement, {
      as: 'a'
    }),
    [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
      styles: {
        root: {
          margin: '0.1rem 0 0'
        }
      }
    }),
    [ELEMENT_TODO_LI]: Todo as any,
    [ELEMENT_TAG]: TagElement as any,
    [ELEMENT_MENTION]: MentionElement as any,
    [ELEMENT_ILINK]: QuickLinkElement as any,
    [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any
  })

export const getTodoPlugins = (uploadImage?: UploadImageFn) => {
  const plugins = createPlugins(generateTodoPlugins(uploadImage), { components: getComponents() })
  return plugins
}
