import { useMemo } from 'react'
import { useMatch } from 'react-router-dom'

import styled from 'styled-components'

import { SecondaryButton } from '@workduck-io/mex-components'

import { usePublicNodeStore } from '@mexit/core'
import { MexIcon, PrimaryText } from '@mexit/shared'

import { getTitleFromPath } from '../Hooks/useLinks'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'

const PublicNoteFooterContainer = styled.section`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.tokens.surfaces.app};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};

  ${PrimaryText} {
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
  }

  ${SecondaryButton} {
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }

  #previous-public-note {
    margin-right: auto;
  }

  #next-public-note {
    margin-left: auto;
  }
`

const PublicNoteFooter = ({ nodeId }: { nodeId: string }) => {
  const { goTo } = useRouting()
  const iLinks = usePublicNodeStore((store) => store.iLinks)
  const publicNamespaceMatch = useMatch(`${ROUTE_PATHS.namespaceShare}/:namespaceid/node/:nodeid`)

  const prevNode = useMemo(() => {
    const currentAt = iLinks.findIndex((i) => i.nodeid === nodeId)

    return currentAt - 1 >= 0 && iLinks.at(currentAt - 1)
  }, [nodeId, iLinks])

  const nextNode = useMemo(() => {
    const currentAt = iLinks.findIndex((i) => i.nodeid === nodeId)

    return currentAt + 1 <= iLinks.length - 1 && iLinks.at(currentAt + 1)
  }, [nodeId, iLinks])

  const handleClick = (nodeId: string) => {
    if (publicNamespaceMatch && nodeId) {
      goTo(`${ROUTE_PATHS.namespaceShare}/${publicNamespaceMatch.params.namespaceid}/node`, NavigationType.push, nodeId)
    }
  }

  return (
    <PublicNoteFooterContainer>
      {prevNode && (
        <SecondaryButton id="previous-public-note" onClick={() => handleClick(prevNode?.nodeid)}>
          <PrimaryText>
            <MexIcon margin="0 0.25rem 0 0" width={20} icon="ri:file-list-2-line" />
            {getTitleFromPath(prevNode.path)}
          </PrimaryText>
        </SecondaryButton>
      )}
      {nextNode && (
        <SecondaryButton id="next-public-note" onClick={() => handleClick(nextNode?.nodeid)}>
          <PrimaryText>
            <MexIcon margin="0 0.25rem 0 0" height={20} icon="ri:file-list-2-line" />
            {getTitleFromPath(nextNode.path)}
          </PrimaryText>
        </SecondaryButton>
      )}
    </PublicNoteFooterContainer>
  )
}

export default PublicNoteFooter
