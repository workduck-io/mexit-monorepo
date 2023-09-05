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

import { optionsCreateNodeIdPlugin } from '../../Editor/Plugins/options'

const generateCommentPlugins = () => {
  return [
    createParagraphPlugin(), // paragraph element
    createLinkPlugin(), // Link
    createBoldPlugin(), // bold mark
    createItalicPlugin(), // italic mark
    createUnderlinePlugin(), // underline mark
    createStrikethroughPlugin(), // strikethrough mark
    createNodeIdPlugin(optionsCreateNodeIdPlugin)
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
  })

export const getCommentPlugins = () => {
  const plugins = createPlugins(generateCommentPlugins(), { components: getComponents() })
  return plugins
}
