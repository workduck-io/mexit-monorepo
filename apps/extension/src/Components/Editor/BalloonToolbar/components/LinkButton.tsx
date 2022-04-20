import Tippy, { TippyProps } from '@tippyjs/react' // optional
import {
  ELEMENT_LINK,
  getAbove,
  getPlateEditorRef,
  getPluginType,
  isCollapsed,
  LinkToolbarButtonProps,
  someNode,
  unwrapNodes
} from '@udecode/plate'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ReactEditor } from 'slate-react'
import { useBalloonToolbarStore } from '..'
import { HeadlessButton } from '@mexit/shared'
// import { Input } from '../../../../style/Form'
import { clearAllSelection } from '@mexit/shared'
import { upsertLinkAtSelection } from '../upsertLinkAtSelection'
import { LinkButtonStyled } from './LinkButton.styles'
import { mog } from '@mexit/core'

type LinkButtonProps = LinkToolbarButtonProps

const LinkButton = ({ getLinkUrl, ...props }: LinkButtonProps) => {
  const editor = getPlateEditorRef()

  const type = getPluginType(editor, ELEMENT_LINK)
  const isFocused = useBalloonToolbarStore((s) => s.isFocused)
  const setIsHidden = useBalloonToolbarStore((s) => s.setIsHidden)
  const setIsFocused = useBalloonToolbarStore((s) => s.setIsFocused)

  const isLink = !!editor?.selection && someNode(editor, { match: { type } })
  const [inp, setInp] = useState({
    prev: ''
  })

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
    getValues,
    reset
  } = useForm()

  useEffect(() => {
    if (!editor) return
    const linkNode = getAbove(editor, {
      match: { type }
    })
    try {
      if (inp.prev === '' && linkNode) {
        setInp({
          prev: linkNode[0].url as string
        })
      }
    } catch (e) {
      mog("useEffect couldn't get the input from linkNode", { e })
    }
  }, [editor, inp.prev, type])

  const extractLinkUrl = async (): Promise<{ url: string; linkNode: any }> => {
    // Blur focus returns
    if (!editor || ReactEditor.isFocused(editor)) return

    const linkNode = getAbove(editor, {
      match: { type }
    })

    let url = ''
    if (getLinkUrl) {
      const tempUrl = await getLinkUrl(inp.prev)
      if (tempUrl) {
        url = tempUrl
      }
    } else {
      // Get url from user
      const val = getValues()
      // console.log({ val });

      if (val['link-input']) url = val['link-input']
    }

    return { url, linkNode: linkNode }
  }

  const onSubmitLink = async () => {
    if (!editor) return
    const d = await extractLinkUrl()
    if (d === undefined) return
    const { url, linkNode } = d

    // mog('Insertion Insterion', { url, linkNode })
    // Inserting of the link
    const sel = editor.prevSelection
    if (url) {
      // mog('Insertion Insterion 2', { url, linkNode, sel })
      if (linkNode && sel) {
        // mog('Insertion Insterion 3', { url, linkNode, sel })
        unwrapNodes(editor, {
          at: sel,
          match: { type: getPluginType(editor, ELEMENT_LINK) }
        })
      } else {
        const shouldWrap: boolean = linkNode !== undefined && isCollapsed(sel)
        // mog('Insertion Insterion 4', { url, linkNode, sel, shouldWrap })
        upsertLinkAtSelection(editor, { url, wrap: shouldWrap, at: sel })
      }
    }

    clearAllSelection(editor as any)
    setInp({ prev: '' })
    reset()
  }

  const { icon, tooltip } = props

  const tooltipProps: TippyProps = {
    content: '',
    arrow: true,
    offset: [0, 17],
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    ...tooltip
  }

  const linkInput = (
    <LinkButtonStyled focused={isFocused} className="button_of_link">
      <form
        // Handle submit on Enter
        onSubmit={handleSubmit(onSubmitLink)}
        onBlur={() => {
          // When focus is lost, reset the state, hide toolbar
          clearAllSelection(editor as any)
          setIsFocused(false)
          setIsHidden(true)
        }}
      >
        <HeadlessButton active={isLink.toString()} as={undefined as any} type="submit" {...props}>
          {icon}
        </HeadlessButton>
        <input
          onMouseDownCapture={() => {
            // When mouse click is captured, don't hide the toolbar
            setIsFocused(true)
          }}
          placeholder="Paste link here..."
          defaultValue={inp.prev}
          type="text"
          {...register('link-input')}
        />
      </form>
    </LinkButtonStyled>
  )

  return tooltip ? <Tippy {...tooltipProps}>{linkInput}</Tippy> : linkInput
}

export default LinkButton
