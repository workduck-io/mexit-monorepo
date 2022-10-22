import { IS_DEV, mog } from '@mexit/core'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'
import { useMentions } from '../../Hooks/useMentions'
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

const useTypeMap = () => {
  const { getPathFromNodeid } = useLinks()
  const { getUserFromUserid } = useMentions()

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
    /* {
    "type": "ilink",
    "children": [
        {
            "text": "",
            "id": "TEMP_yqiYm"
        }
    ],
    "value": "NODE_8RBWkaMrNDNBD8PyFeqjn",
    "id": "TEMP_VUwh7"
} */
    ilink: (children, node) => {
      const title = getTitleFromPath(getPathFromNodeid(node?.value))
      return (
        <a href={node?.value}>
          [[{title}]]
          <Plateless content={children} />
        </a>
      )
    },
    /*

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
    mention: (children, node) => {
      const u = getUserFromUserid(node?.value)
      // if (u) return u

      return (
        <a href={node?.value}>
          @{u ? u?.alias : node?.email ?? node?.value}
          <Plateless content={children} />
        </a>
      )
    },
    /*
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
    tag: (children, node) => (
      <a href={node?.value}>
        #{node?.value}
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

  return typeMap
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

  return final
}

const Plateless = ({ content }: PlatelessProps) => {
  const typeMap = useTypeMap()
  // mog('Plateless', { content })
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
          mog('Plateless Error: Cannot render node', { node })
          return null
        })}
    </PlatelessStyled>
  )
}

export default Plateless
