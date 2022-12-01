import { optionsCreateNodeIdPlugin } from '../../Editor/Plugins/options'
import {
  createBoldPlugin,
  createItalicPlugin,
  createLinkPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createPlateUI,
  createPlugins,
  createStrikethroughPlugin,
  createUnderlinePlugin,
  ELEMENT_LINK,
  ELEMENT_PARAGRAPH,
  LinkElement,
  StyledElement,
  withProps
} from '@udecode/plate'

const generateCommentPlugins = () => {
  return [
    // elements
    createParagraphPlugin(), // paragraph element

    createLinkPlugin(), // Link

    // Marks
    createBoldPlugin(), // bold mark
    createItalicPlugin(), // italic mark
    createUnderlinePlugin(), // underline mark
    createStrikethroughPlugin(), // strikethrough mark
    createNodeIdPlugin(optionsCreateNodeIdPlugin)

    // createHighlightPlugin(), // highlight mark
    // createTodoListPlugin(),
    //
    // createImagePlugin({
    //   options: {
    //     uploadImage
    //   }
    // }), // Image
    // createBlockModifierPlugin(),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    // createMediaEmbedPlugin({
    //   isInline: true,
    //   options: {
    //     transformUrl: parseIframeUrl,
    //     rules: [
    //       {
    //         parser: parseTwitterUrl,
    //         component: MediaEmbedTweet
    //       },
    //       {
    //         parser: parseVideoUrl,
    //         component: MediaEmbedVideo
    //       },
    //       {
    //         parser: parseRestMediaUrls,
    //         component: MediaIFrame
    //       }
    //     ]
    //   }
    // })

    // Single line for the editor
    // createSingleLinePlugin()

    // Custom Plugins
    // createTodoPlugin(),
    // createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin)

    // Comboboxes
    // createTagPlugin(), // Tags
    // createMentionPlugin(), // Mentions
    // createILinkPlugin(), // Internal Links ILinks
    // createInlineBlockPlugin(),
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
    })
    // [ELEMENT_TAG]: TagElement as any,
    // [ELEMENT_MENTION]: MentionElement as any,
    // [ELEMENT_ILINK]: QuickLinkElement as any,
    // [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any
  })

export const getCommentPlugins = () => {
  const plugins = createPlugins(generateCommentPlugins(), { components: getComponents() })
  return plugins
}
