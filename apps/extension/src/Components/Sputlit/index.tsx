import React, { useEffect, useRef } from 'react'

import { ActionType, QuickLinkType, useAuthStore, useHighlightStore } from '@mexit/core'

import { useHighlighter } from '../../Hooks/useHighlighter'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import Content from '../Content'
import { SputlitLogin } from '../Login'
import Search from '../Search'

import { Main, Overlay, SputlitContainer, Wrapper } from './styled'

const appearanceAnimationKeyframes = [
  {
    opacity: 0,
    transform: 'scale(0.97)'
  },
  { opacity: 1, transform: 'scale(1.01)' },
  { opacity: 1, transform: 'scale(1)' }
]

const Sputlit = () => {
  const authenticated = useAuthStore((s) => s.authenticated)
  const { visualState, setVisualState } = useSputlitContext()
  const activeItem = useSputlitStore((s) => s.activeItem)
  const resetSputlit = useSputlitStore((s) => s.reset)
  const { removeHighlight } = useHighlighter()
  const getHighlightsOfUrl = useHighlightStore((s) => s.getHighlightsOfUrl)

  const outerRef = React.useRef<HTMLDivElement>(null)
  const innerRef = React.useRef<HTMLDivElement>(null)

  const enterMs = 200
  const exitMs = 100

  // Show/hide animation
  useEffect(() => {
    if (visualState === VisualState.showing) {
      return
    }

    const duration = visualState === VisualState.animatingIn ? enterMs : exitMs

    const element = outerRef.current

    element?.animate(appearanceAnimationKeyframes, {
      duration,
      easing: visualState === VisualState.animatingOut ? 'ease-in' : 'ease-out',
      direction: visualState === VisualState.animatingOut ? 'reverse' : 'normal',
      fill: 'forwards'
    })
  }, [visualState])

  useEffect(() => {
    // * Remove unsaved highlight from Page
    return () => {
      const selection = useSputlitStore.getState().selection
      if (selection?.id) {
        const highlighted = getHighlightsOfUrl(window.location.href)
        const isPresent = !!highlighted?.find((h) => h.entityId === selection.id)

        if (!isPresent) {
          removeHighlight(selection?.id)
        }
      }
      resetSputlit()
    }
  }, [])

  const isExternalSearchAction =
    activeItem?.category === QuickLinkType.action &&
    !activeItem?.extras?.withinMex &&
    activeItem?.type === ActionType.SEARCH

  // Height animation
  const previousHeight = useRef<number>()
  useEffect(() => {
    // Only animate if we're actually showing
    if (visualState === VisualState.showing) {
      const outer = outerRef.current
      const inner = innerRef.current

      if (!outer || !inner) {
        return
      }

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect

          if (!previousHeight.current) {
            previousHeight.current = cr.height
          }

          outer.animate(
            [
              {
                height: `${previousHeight.current}px`
              },
              {
                height: `${cr.height}px`
              }
            ],
            {
              duration: enterMs / 2,
              easing: 'ease-out',
              fill: 'forwards'
            }
          )
          previousHeight.current = cr.height
        }
      })

      ro.observe(inner)

      return () => {
        ro.unobserve(inner)
      }
    }
  }, [visualState])

  return (
    <SputlitContainer id="sputlit-container">
      <Wrapper ref={outerRef}>
        <Main id="sputlit-main" ref={innerRef}>
          {!authenticated ? (
            <SputlitLogin />
          ) : (
            <>
              <Search />
              {!isExternalSearchAction && <Content />}
            </>
          )}
        </Main>
      </Wrapper>
      <Overlay
        id="sputlit-overlay"
        onClick={() => {
          setVisualState(VisualState.animatingOut)
        }}
      />
    </SputlitContainer>
  )
}

export default Sputlit
