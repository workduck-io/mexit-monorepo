import React, { useMemo, useState } from 'react'

import globalLine from '@iconify-icons/ri/global-line'
import { transparentize } from 'polished'
import styled, { css, useTheme } from 'styled-components'

import { apiURLs, mog, ShareContext } from '@mexit/core'
import { ToggleButton, Loading, CardTitle } from '@mexit/shared'
import { MexIcon, CopyButton } from '@mexit/shared'

import { useNamespaceApi } from '../../Hooks/API/useNamespaceAPI'
import { useApi } from '../../Hooks/API/useNodeAPI'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useEditorStore } from '../../Stores/useEditorStore'

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
  const { makeNotePrivate, makeNotePublic, isPublic } = useApi()
  // const { makeNamespacePublic, makeNamespacePrivate } = useNamespaceApi()
  const { isNamespacePublic, makeNamespacePublic } = useNamespaces()

  const publicUrl = useMemo(() => {
    if (context === 'note') {
      return isPublic(id) ? apiURLs.getPublicNodePath(id) : undefined
    } else if (context === 'space') {
      return isNamespacePublic(id) ? apiURLs.namespaces.getPublicURL(id) : undefined
    }
  }, [id, isPublic, context, isNamespacePublic])

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
          <CardTitle>Make this {context} public?</CardTitle>
          <ItemDesc>Publish and share the link with everyone!</ItemDesc>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '.5rem' }}>
          {publicUrl && (
            <CopyButton text={publicUrl} size="20px" beforeCopyTooltip="Copy link" afterCopyTooltip="Link copied!" />
          )}
        </span>
        {isLoading ? (
          <Loading dots={3} transparent />
        ) : (
          <ToggleButton
            id="toggle-public"
            value={!!publicUrl}
            size="sm"
            onChange={flipPublicAccess}
            checked={!!publicUrl}
          />
        )}
      </div>
    </Container>
  )
}

export default ShareOptions
