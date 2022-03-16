import { LinkCapture, parseSnippet, Snippet } from '@mexit/shared'
import React from 'react'
import { useSnippets } from '../../Hooks/useSnippets'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { ComboboxItem, ComboboxRoot, Img, ItemCenterWrapper, ItemDesc, ItemTitle } from './styled'

import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { useShortenerStore } from '../../Hooks/useShortener'

// TODO: whether or not to enable dibba should be a user's preference
// we don't users to move away because they have doubts of us forcing a 'keylogger' on them
export default function Dibba() {
  const { dibbaState, setDibbaState } = useSputlitContext()
  const linkCaptures = useShortenerStore((store) => store.linkCaptures)
  const snippets = useSnippets().getSnippets()

  console.log('snippets', snippets, 'link Captures', linkCaptures)

  const insertSnippet = (item: Snippet) => {
    dibbaState.extra.range.deleteContents()
    dibbaState.extra.range.insertNode(document.createTextNode(parseSnippet(item).text))
    setDibbaState({ visualState: VisualState.hidden })
  }

  const insertLink = (item: LinkCapture) => {
    const link = document.createElement('a')
    link.appendChild(document.createTextNode(item.long))
    link.href = item.long

    dibbaState.extra.range.deleteContents()
    dibbaState.extra.range.insertNode(link)
    setDibbaState({ visualState: VisualState.hidden })
  }

  return (
    <ComboboxRoot
      top={window.scrollY + dibbaState.coordinates.top}
      left={window.scrollX + dibbaState.coordinates.left}
      isOpen={dibbaState.visualState === VisualState.hidden ? false : true}
    >
      {linkCaptures.map((item, index) => {
        // const Item = onRenderItem ? onRenderItem({ item }) : item.text
        // const text = item.text

        return (
          <ComboboxItem
            // key={`${item.key}-${String(index)}`}
            highlighted={false}
            // {...comboProps(item, index)}
            onMouseDown={() => {
              console.log('link', item)
              insertLink(item)
            }}
          >
            <Img src={`https://www.google.com/s2/favicons?domain=${item.long}&sz=${18}`} />
            <ItemCenterWrapper>
              <ItemTitle>{item.short}</ItemTitle>
              {/* {item.desc && <ItemDesc>{item.desc}</ItemDesc>} */}
            </ItemCenterWrapper>
            {/* {item.rightIcons && (
              <ItemRightIcons>
                {item.rightIcons.map((i: string) => (
                  <Icon key={item.key + i} icon={i} />
                ))}
              </ItemRightIcons>
            )} */}
          </ComboboxItem>
        )
      })}
      {snippets.map((item, index) => {
        // const Item = onRenderItem ? onRenderItem({ item }) : item.text
        // const text = item.text

        return (
          <ComboboxItem
            // key={`${item.key}-${String(index)}`}
            highlighted={false}
            // {...comboProps(item, index)}
            onMouseDown={() => {
              console.log('parsed snippet', parseSnippet(item))
              insertSnippet(item)
            }}
          >
            <Icon height={18} key={item.id} icon={quillPenLine} />
            <ItemCenterWrapper>
              <ItemTitle>{item.title}</ItemTitle>
              {/* {item.desc && <ItemDesc>{item.desc}</ItemDesc>} */}
            </ItemCenterWrapper>
            {/* {item.rightIcons && (
              <ItemRightIcons>
                {item.rightIcons.map((i: string) => (
                  <Icon key={item.key + i} icon={i} />
                ))}
              </ItemRightIcons>
            )} */}
          </ComboboxItem>
        )
      })}
    </ComboboxRoot>
  )
}
