import React, { useMemo, useState } from 'react'

import globalLine from '@iconify-icons/ri/global-line'
import { transparentize } from 'polished'
import styled, { css, useTheme } from 'styled-components'

import { apiURLs, mog, ShareContext } from '@mexit/core'
import { CardTitle, CopyButton, Loading, MexIcon, ToggleButton } from '@mexit/shared'

import { useApi } from '../../Hooks/API/useNodeAPI'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNodes } from '../../Hooks/useNodes'

const Flex = css`
  display: flex;
  align-items: center;
  background: ${({ theme }) => transparentize(0.5, theme.colors.background.card)};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`

const Container = styled.div`
  ${Flex}
  padding: ${({ theme }) => theme.spacing.medium} 0;
`

const ItemDesc = styled.div`
  margin-top: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface ShareOptionsProps {
  context: ShareContext
  id: string
}

const ShareOptions = ({ context, id }: ShareOptionsProps) => {
  // const node = useEditorStore((store) => store.node)
  const theme = useTheme()

  const [isLoading, setIsLoading] = useState(false)
  const { makeNotePrivate, makeNotePublic } = useApi()
  const isPublic = useNodes().isPublicNode
  // const { makeNamespacePublic, makeNamespacePrivate } = useNamespaceApi()
  const { getNamespaceOfNodeid, isNamespacePublic, makeNamespacePublic } = useNamespaces()

  const publicUrl = useMemo(() => {
    if (context === 'note') {
      return isPublic(id) ? apiURLs.frontend.getPublicNodePath(id) : undefined
    } else if (context === 'space') {
      return isNamespacePublic(id) ? apiURLs.frontend.getPublicNSURL(id) : undefined
    }
  }, [id, isPublic, context, isNamespacePublic])

  const noteNamespacePublicLink = useMemo(() => {
    if (context === 'note') {
      const namespace = getNamespaceOfNodeid(id)
      return namespace && isNamespacePublic(namespace.id)
        ? apiURLs.frontend.getPublicURLofNoteInNS(namespace.id, id)
        : undefined
    }
    return undefined
  }, [id, context])

  // Helper function to set loading
  const tryError = async (fn: () => Promise<void>) => {
    try {
      const resp = await fn()
      mog('Try', { resp })
    } catch (error) {
      mog('Error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const flipPublicAccess = async () => {
    setIsLoading(true)
    if (context === 'note') {
      // Go from public -> private
      if (publicUrl) {
        await tryError(async () => {
          const resp = await makeNotePrivate(id)
          mog('MakingNodePrivateResp', { resp })
        })
      } else {
        // Private to Public
        await tryError(async () => {
          const resp = await makeNotePublic(id)
          mog('MakingNodePulicResp', { resp })
        })
      }
    } else if (context === 'space') {
      if (publicUrl) {
        await tryError(async () => {
          const resp = await makeNamespacePublic(id, false)
          mog('MakingNamespacePrivateResp', { resp })
        })
      } else {
        // Private to Public
        await tryError(async () => {
          const resp = await makeNamespacePublic(id, true)
          mog('MakingNamespacePulicResp', { resp })
        })
      }
    }
  }
  // mog('PublicURL', { publicUrl, context, id })

  return (
    <Container>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <MexIcon color={theme.colors.primary} icon={globalLine} fontSize={24} margin="0 1rem 0 0" />
        <div style={{ gap: '1', userSelect: 'none' }}>
          {context === 'note' && noteNamespacePublicLink ? (
            <>
              <CardTitle>This note is in a public space.</CardTitle>
              <ItemDesc>Share the public space link</ItemDesc>
            </>
          ) : (
            <>
              <CardTitle>Make this {context} public?</CardTitle>
              <ItemDesc>Publish and share the link with everyone!</ItemDesc>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '.5rem' }}>
          {noteNamespacePublicLink ? (
            <CopyButton
              text={noteNamespacePublicLink}
              size="20px"
              beforeCopyTooltip="Copy link"
              afterCopyTooltip="Link copied!"
            />
          ) : (
            publicUrl && (
              <CopyButton text={publicUrl} size="20px" beforeCopyTooltip="Copy link" afterCopyTooltip="Link copied!" />
            )
          )}
        </span>
        {isLoading ? (
          <Loading dots={3} transparent />
        ) : (
          noteNamespacePublicLink === undefined && (
            <ToggleButton
              id="toggle-public"
              value={!!publicUrl}
              size="sm"
              onChange={flipPublicAccess}
              checked={!!publicUrl}
            />
          )
        )}
      </div>
    </Container>
  )
}

export default ShareOptions
