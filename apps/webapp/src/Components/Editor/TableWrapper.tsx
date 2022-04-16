import DeleteTableIcon from '@iconify/icons-fluent/delete-20-filled'
import DeleteColumnIcon from '@iconify/icons-fluent/table-delete-column-20-filled'
import DeleteRowIcon from '@iconify/icons-fluent/table-delete-row-20-filled'
import AddRowIcon from '@iconify/icons-fluent/table-stack-down-20-filled'
import AddColumnIcon from '@iconify/icons-fluent/table-stack-right-20-filled'
import {
  addColumn,
  addRow,
  deleteColumn,
  deleteRow,
  deleteTable,
  Popover,
  TableElement,
  TableElementProps,
  TableToolbarButton
} from '@udecode/plate'
import { ErrorBoundary } from 'react-error-boundary'
import styled, { useTheme } from 'styled-components'
import { MexIcon } from '@mexit/shared'
import { ButtonSeparator } from '@mexit/shared'

const JustifyCenter = styled.div<{ width: string; height: string }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${(props) => props.width};
  height: ${(props) => props.height};
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
    <>
      <TableToolbarButton
        tooltip={{ content: 'Add Row', ...tooltip }}
        icon={<MexIcon icon={AddRowIcon} />}
        transform={addRow}
      />
      <TableToolbarButton
        tooltip={{ content: 'Add Column', ...tooltip }}
        icon={<MexIcon icon={AddColumnIcon} />}
        transform={addColumn}
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
    </>
  )
}

export const TableModal = ({ element, popoverProps, children }: TableElementProps) => (
  <Popover content={<TableToolbarButtons />} {...popoverProps}>
    {children}
  </Popover>
)

const TableWrapper = (props: any) => {
  console.log('poops', props)
  return (
    <ErrorBoundary fallback={<></>}>
      <TableElement {...props} onRenderContainer={TableModal} id="hello" />
    </ErrorBoundary>
  )
}

export default TableWrapper
