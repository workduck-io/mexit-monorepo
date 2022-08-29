import React from 'react'

import DeleteTableIcon from '@iconify/icons-fluent/delete-20-filled'
import DeleteColumnIcon from '@iconify/icons-fluent/table-delete-column-20-filled'
import DeleteRowIcon from '@iconify/icons-fluent/table-delete-row-20-filled'
import AddRowIcon from '@iconify/icons-fluent/table-stack-down-20-filled'
import AddColumnIcon from '@iconify/icons-fluent/table-stack-right-20-filled'
import {
  insertTableColumn,
  insertTableRow,
  deleteColumn,
  deleteRow,
  deleteTable,
  ElementPopover,
  TableElement,
  TableElementProps,
  TableToolbarButton,
  Value
} from '@udecode/plate'
import { ErrorBoundary } from 'react-error-boundary'
import styled, { useTheme } from 'styled-components'

import { MexIcon } from '../Style/Layouts'
import { ButtonSeparator } from '../Style/Toolbar'

const JustifyCenter = styled.div<{ width: string; height: string }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${(props) => props.width};
  height: ${(props) => props.height};
`

const StyledTableToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.tiny};
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
`

const TableToolbarButtons = () => {
  const theme = useTheme()
  const tooltip = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    theme: 'mex',
    hideOnClick: false,
    offset: [0, 17],
    placement: 'bottom'
  } as any
  return (
    <StyledTableToolbar>
      <TableToolbarButton
        tooltip={{ content: 'Add Row', ...tooltip }}
        icon={<MexIcon icon={AddRowIcon} />}
        transform={insertTableRow}
      />
      <TableToolbarButton
        tooltip={{ content: 'Add Column', ...tooltip }}
        icon={<MexIcon icon={AddColumnIcon} />}
        transform={insertTableColumn}
      />
      <TableToolbarButton
        tooltip={{ content: 'Delete Row', ...tooltip }}
        icon={<MexIcon icon={DeleteRowIcon} />}
        transform={deleteRow}
      />
      <TableToolbarButton
        tooltip={{ content: 'Delete Column', ...tooltip }}
        icon={<MexIcon icon={DeleteColumnIcon} />}
        transform={deleteColumn}
      />
      <JustifyCenter width="1rem" height="inherit">
        <ButtonSeparator />
      </JustifyCenter>
      <TableToolbarButton
        icon={<MexIcon color={theme.colors.primary} icon={DeleteTableIcon} />}
        transform={deleteTable}
        tooltip={{ content: 'Delete Table', ...tooltip }}
      />
    </StyledTableToolbar>
  )
}

export const TableModal = ({ element, popoverProps, children }: TableElementProps<Value>) => (
  <ElementPopover content={<TableToolbarButtons />} {...popoverProps}>
    {children}
  </ElementPopover>
)

export const TableWrapper = (props: any) => {
  return (
    <ErrorBoundary fallback={<></>}>
      <TableElement {...props} popoverProps={{ content: <TableToolbarButtons /> }} id="hello" />
    </ErrorBoundary>
  )
}
