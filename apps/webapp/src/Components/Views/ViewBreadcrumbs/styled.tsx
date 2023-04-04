import styled from 'styled-components'

import { Breadcrumbs } from '@workduck-io/mex-components'

import { EditorBreadcrumbs, Group } from '@mexit/shared'

export const ViewBreadcrumbsContainer = styled(EditorBreadcrumbs)`
  padding: 0;
  ${Group} {
    margin: ${({ theme }) => theme.spacing.tiny} 0;
    padding: ${({ theme }) => theme.spacing.small} 0;
  }
`

export const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 0;
`
