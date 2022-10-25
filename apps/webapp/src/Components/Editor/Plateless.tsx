import { IS_DEV, mog } from '@mexit/core'
import React from 'react'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'
import { useMentions } from '../../Hooks/useMentions'
import { PlatelessStyled } from './Plateless.style'

import {
  ELEMENT_ILINK,
  ELEMENT_TAG,
  ELEMENT_TODO_LI,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_LINK,
  ELEMENT_PARAGRAPH,
  ELEMENT_MENTION,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
  ELEMENT_LIC
} from '@mexit/core'

const headingRender = (children: any, node: any) => {
  return (
    <b>
      {node.text && node.text}
      <Plateless content={children} />
    </b>
  )
}

const useTypeMap = (multiline: boolean) => {
  const { getPathFromNodeid } = useLinks()
  const { getUserFromUserid } = useMentions()

  /**
   * This is the common type map for single line and multiline
   * For elements specific to multiline, see multilineTypeMap
   */
  const typeMap = {
    [ELEMENT_PARAGRAPH]: (children, node) => (
      <p>
        {node.text && node.text}
        <RenderPlateless content={children} />
      </p>
    ),

    [ELEMENT_LINK]: (children, node) => (
      <a href={node?.href}>
        {node.text && node.text}
        <RenderPlateless content={children} />
      </a>
    ),

    /*
     * ILink
     {
      "type": "ilink",
      "children": [
          {
              "text": "",
              "id": "TEMP_yqiYm"
          }
      ],
      "value": "NODE_8RBWkaMrNDNBD8PyFeqjn",
      "id": "TEMP_VUwh7"
    }
    */
    [ELEMENT_ILINK]: (children, node) => {
      const title = getTitleFromPath(getPathFromNodeid(node?.value))
      return (
        <a href={node?.value}>
          [[{title ?? 'Private/Missing'}]]
          <RenderPlateless content={children} />
        </a>
      )
    },

    /*
     * Mentions
    {
      "type": "mention",
      "children": [
          {
              "text": "",
              "id": "TEMP_iXQcF"
          }
      ],
      "value": "cbb01181-a048-4a2d-adef-0dc0c3490ab6",
      "id": "TEMP_AjeM9"
    }
    */
    [ELEMENT_MENTION]: (children, node) => {
      const u = getUserFromUserid(node?.value)
      // if (u) return u

      return (
        <a href={node?.value}>
          @{u ? u?.alias : node?.email ?? node?.value}
          <RenderPlateless content={children} />
        </a>
      )
    },

    /* Tag
    {
    "type": "tag",
    "children": [
        {
            "text": "",
            "id": "TEMP_nABX4"
        }
    ],
    "value": "taggerHalo",
    "id": "TEMP_aGFct"
    }
    */
    [ELEMENT_TAG]: (children, node) => (
      <a href={node?.value}>
        #{node?.value}
        <RenderPlateless content={children} />
      </a>
    ),

    [ELEMENT_H1]: headingRender,
    [ELEMENT_H2]: headingRender,
    [ELEMENT_H3]: headingRender,
    [ELEMENT_H4]: headingRender,
    [ELEMENT_H5]: headingRender,
    [ELEMENT_H6]: headingRender
  }

  const multilineTypeMap = {
    /**
     * Blockquote
     */
    [ELEMENT_BLOCKQUOTE]: (children, node) => (
      <blockquote>
        {node.text && node.text}
        <RenderPlateless content={children} multiline />
      </blockquote>
    ),

    [ELEMENT_UL]: (children, node) => (
      <ul>
        <RenderPlateless content={children} multiline />
      </ul>
    ),
    [ELEMENT_OL]: (children, node) => (
      <ol>
        <RenderPlateless content={children} multiline />
      </ol>
    ),
    [ELEMENT_LIC]: (children, node) => <Plateless content={children} multiline />,
    [ELEMENT_LI]: (children, node) => (
      <li>
        <RenderPlateless content={children} multiline />
      </li>
    ),
    [ELEMENT_TODO_LI]: (children, node) => {
      mog('action-item', { node, children })
      return (
        <li>
          <RenderPlateless content={children} multiline />
        </li>
      )
    }
  }

  return multiline ? { ...multilineTypeMap, ...typeMap } : typeMap
}

const plainTextRenderer = (node: any) => {
  const render = node.text || ''
  let final = render
  /*
   * Bold
  {
    "id": "TEMP_ByWdY",
    "text": "styles",
    "bold": true
  }
  */
  if (node.bold) {
    final = <b>{render}</b>
  }

  /*
   * Italic
  {
    "id": "TEMP_d6i8a",
    "text": "best",
    "italic": true
  }
   */
  if (node.italic) {
    final = <i>{render}</i>
  }

  /*
   * Strikethrough
  {
    "id": "TEMP_daMpy",
    "text": "are",
    "strikethrough": true
  },
  */
  if (node.strikethrough) {
    final = <s>{render}</s>
  }

  /*
   * Code
   */
  if (node.code) {
    final = <code>{render}</code>
  }

  return <span>{final}</span>
}

export interface PlatelessProps {
  content: any[]
  multiline?: boolean
  root?: boolean
}

const RenderPlateless = React.memo<PlatelessProps>(({ content, multiline = false }: PlatelessProps) => {
  const typeMap = useTypeMap(multiline)
  // mog('Plateless', { content })
  const childrenRender =
    content &&
    content.map((node) => {
      if (Object.keys(typeMap).includes(node?.type)) {
        return typeMap[node.type](node.children, node)
      }
      if (node.type === undefined && node.text !== undefined) {
        return plainTextRenderer(node)
      }
      mog('Plateless Error: Cannot render node', { node })
      // Unrenderable elements are skipped
      return null
    })
  return <>{childrenRender}</>
})

/**
 * A barebones renderer for plate content in html
 * Single line for now
 */
const Plateless = ({ content, multiline = false, root = false }: PlatelessProps) => {
  return (
    <PlatelessStyled readOnly multiline={multiline}>
      <RenderPlateless content={content} multiline={multiline} />
    </PlatelessStyled>
  )
}

export default Plateless
