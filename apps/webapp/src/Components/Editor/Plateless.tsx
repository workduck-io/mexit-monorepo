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
  h1: headingrender,
  h2: headingrender,
  h3: headingrender,
  h4: headingrender,
  h5: headingrender,
  h6: headingrender
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
          return <p>CannotRender [{JSON.stringify(node)}]</p>
        })}{' '}
    </PlatelessStyled>
  )
}

export default Plateless
