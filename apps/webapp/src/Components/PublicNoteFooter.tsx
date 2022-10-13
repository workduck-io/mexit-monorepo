import { useMemo } from 'react'

import { useMatch } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { MexIcon, PrimaryText } from '@mexit/shared'

import { getTitleFromPath } from '../Hooks/useLinks'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { usePublicNodeStore } from '../Stores/usePublicNodes'

const PublicNoteFooterContainer = styled.section`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  /* padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large}; */

  ${PrimaryText} {
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
  }

  ${Button} {
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
        <Button id="previous-public-note" onClick={() => handleClick(prevNode?.nodeid)} transparent>
          <PrimaryText>
            <MexIcon margin="0 0.25rem 0 0" width={20} icon="ri:file-list-2-line" />
            {getTitleFromPath(prevNode.path)}
          </PrimaryText>
        </Button>
      )}
      {nextNode && (
        <Button id="next-public-note" onClick={() => handleClick(nextNode?.nodeid)} transparent>
          <PrimaryText>
            <MexIcon margin="0 0.25rem 0 0" height={20} icon="ri:file-list-2-line" />
            {getTitleFromPath(nextNode.path)}
          </PrimaryText>
        </Button>
      )}
    </PublicNoteFooterContainer>
  )
}

export default PublicNoteFooter
