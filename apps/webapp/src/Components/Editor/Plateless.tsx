import { mog } from '@mexit/core'
import { EditorStyles } from '@mexit/shared'
import React from 'react'
import { PlatelessStyled } from './Plateless.style'

export interface PlatelessProps {
  content: any[]
}

const headingrender = (children: any, node: any) => {
  return (
    <b>
      {node.text && node.text}
      <Plateless content={children} />
    </b>
  )
}

/*
 *
 * {
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

const typeMap = {
  p: (children, node) => (
    <p>
      {node.text && node.text}
      <Plateless content={children} />
    </p>
  ),
  a: (children, node) => (
    <a href={node?.href}>
      {node.text && node.text}
      <Plateless content={children} />
    </a>
  ),
  ilink: (children, node) => (
    <a href={node?.value}>
      {node.text && node.text}
      <Plateless content={children} />
    </a>
  ),
  mention: (children, node) => (
    <a href={node?.value}>
      {node.text && node.text}
      <Plateless content={children} />
    </a>
  ),

  h1: headingrender,
  h2: headingrender,
  h3: headingrender,
  h4: headingrender,
  h5: headingrender,
  h6: headingrender
}

/**
 *
 * [
    {
        "id": "TEMP_3iwCL",
        "text": "Hello there "
    },
    {
        "id": "TEMP_ByWdY",
        "text": "styles",
        "bold": true
    },
    {
        "id": "TEMP_f74b3",
        "text": " "
    },
    {
        "id": "TEMP_daMpy",
        "text": "are",
        "strikethrough": true
    },
    {
        "id": "TEMP_nxbct",
        "text": " my "
    },
    {
        "id": "TEMP_d6i8a",
        "text": "best",
        "italic": true
    },
    {
        "id": "TEMP_ExPJf",
        "text": " "
    }
]
 */

const plainTextRenderer = (node: any) => {
  const render = node.text || ''
  let final = render
  if (node.bold) {
    final = <b>{render}</b>
  }
  if (node.italic) {
    final = <i>{render}</i>
  }
  if (node.strikethrough) {
    final = <s>{render}</s>
  }
  if (node.code) {
    final = <code>{render}</code>
  }
  return final
}

const Plateless = ({ content }: PlatelessProps) => {
  mog('Plateless', { content })
  return (
    <PlatelessStyled readOnly>
      {content &&
        content.map((node) => {
          if (Object.keys(typeMap).includes(node?.type)) {
            return typeMap[node.type](node.children, node)
          }
          if (node.type === undefined && node.text !== undefined) {
            return plainTextRenderer(node)
          }
          return <p>CannotRender [{JSON.stringify(node)}]</p>
        })}{' '}
    </PlatelessStyled>
  )
}

export default Plateless
