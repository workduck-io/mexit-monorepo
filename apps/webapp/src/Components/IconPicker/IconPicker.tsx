import React, { useState } from 'react'
import { mergeRefs } from 'react-merge-refs'

import {
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions
} from '@floating-ui/react-dom-interactions'

import { Emoji, EmojiPicker } from '@workduck-io/mex-components'

import { MIcon } from '@mexit/core'
import { IconDisplay,IconSelector, TooltipWrapper } from '@mexit/shared'

interface IconPickerProps {
  value: MIcon
  size?: number
  tooltipText?: string
  allowPicker?: boolean
  /*
   * Call API or data store and if the call succeeds return the icon
   * Otherwise if null the previous value is restored
   */
  onChange: (icon: MIcon) => Promise<undefined | boolean>
}

const IconPicker = ({ value, size, tooltipText, onChange, allowPicker = false }: IconPickerProps) => {
  // For floating-ui refer:
  // https://codesandbox.io/s/trusting-mendeleev-49qn11?file=/src/App.tsx

  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [emoji, setEmoji] = useState(value)

  const {
    x: tooltipX,
    y: tooltipY,
    reference: tooltipReference,
    floating: tooltipFloating,
    strategy: tooltipStrategy,
    context: tooltipContext
  } = useFloating({
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    middleware: [offset(5), flip(), shift({ padding: 8 })]
  })

  const {
    x: menuX,
    y: menuY,
    reference: menuReference,
    floating: menuFloating,
    strategy: menuStrategy,
    context: menuContext
  } = useFloating({
    placement: 'bottom-start',
    strategy: 'absolute',
    open: menuOpen,
    onOpenChange: setMenuOpen,
    middleware: [offset(5), flip(), shift({ padding: 8 })]
  })

  const { getReferenceProps: getTooltipReferenceProps, getFloatingProps: getTooltipFloatingProps } = useInteractions([
    useHover(tooltipContext),
    useDismiss(tooltipContext)
  ])

  const { getReferenceProps: getMenuReferenceProps, getFloatingProps: getMenuFloatingProps } = useInteractions([
    useClick(menuContext),
    useDismiss(menuContext)
  ])

  const onNewEmoji = (emoji: Emoji) => {
    // mog('onNewEmoji', emoji)
    setMenuOpen(false)
    const newEmojiVal = { type: 'EMOJI' as const, value: emoji.native }
    setEmoji(newEmojiVal)
    onChange(newEmojiVal).then((success) => {
      if (success === undefined) {
        setEmoji(value)
      }
    })
  }

  return (
    <>
      <IconSelector
        ref={mergeRefs([tooltipReference, menuReference])}
        {...getTooltipReferenceProps(getMenuReferenceProps())}
      >
        <IconDisplay icon={emoji} size={size} />
      </IconSelector>
      <FloatingPortal>
        {tooltipOpen && !menuOpen && (
          <TooltipWrapper
            ref={tooltipFloating}
            style={{
              position: tooltipStrategy,
              left: tooltipX ?? 0,
              top: tooltipY ?? 0
            }}
            {...getTooltipFloatingProps()}
          >
            {tooltipText}
            {allowPicker && 'Edit Icon'}
          </TooltipWrapper>
        )}
      </FloatingPortal>
      <FloatingPortal id="floating-picker-root">
        {allowPicker && menuOpen && (
          <div
            ref={menuFloating}
            style={{
              position: menuStrategy,
              left: menuX ?? 0,
              top: menuY ?? 0
            }}
            {...getMenuFloatingProps()}
          >
            <EmojiPicker onSelect={onNewEmoji} data={undefined} />
          </div>
        )}
      </FloatingPortal>
    </>
  )
}

export default IconPicker
