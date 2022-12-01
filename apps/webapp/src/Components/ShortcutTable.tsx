// import { DisplayShortcut } from '@workduck-io/mex-components'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import { Input } from '@mexit/shared'

import { useShortcutStore } from '../Hooks/useShortcutStore'
import useShortcutTableData from '../Hooks/useShortcutTableData'
import { Shortcut } from '../Stores/useHelpStore'
import {
  StyledRow,
  StyledTable,
  StyledTBody,
  StyledTD,
  StyledTH,
  StyledTHead,
  TableHeader,
  TableWrapperScrollable
} from '../Style/ShortcutTable'
import InputShortcut from './InputShortcut'
import { DisplayShortcut } from './Shortcuts'
import { debounce } from 'lodash'
import { matchSorter } from 'match-sorter'

function fuzzyTextFilterFn(data: Shortcut[], search: any) {
  return matchSorter(data, search, { keys: ['title', 'keystrokes', 'category'] })
}

const ShortcutTable = () => {
  const { data, columns } = useShortcutTableData()

  const [tableData, setTableData] = useState(data)
  const [search, setSearch] = useState('')

  const editMode = useShortcutStore((state) => state.editMode)
  const setEditMode = useShortcutStore((state) => state.setEditMode)
  const currentShortcut = useShortcutStore((state) => state.currentShortcut)
  const setCurrentShortcut = useShortcutStore((state) => state.setCurrentShortcut)

  useEffect(() => {
    setEditMode(false)
    if (search) setTableData(fuzzyTextFilterFn(data, search))
    else setTableData(data)
  }, [search, data])

  const onRowClick = (shortcut: any) => {
    setEditMode(true)
    setCurrentShortcut(shortcut)
  }

  return (
    <>
      <TableHeader>
        <h1>Shortcuts</h1>
        <Input
          autoFocus
          type="text"
          placeholder="Search...."
          onChange={debounce((e) => setSearch(e.target.value), 250)}
        />
      </TableHeader>

      <TableWrapperScrollable>
        <StyledTable>
          <StyledTHead>
            {
              <StyledRow>
                {columns.map((column) => (
                  <StyledTH key={`THeader_${column.Header}`}> {column.Header} </StyledTH>
                ))}
              </StyledRow>
            }
          </StyledTHead>

          <StyledTBody>
            {tableData.map((row) => {
              return (
                <StyledRow
                  key={`Row_${row.title}`}
                  highlight={row.title === currentShortcut?.title && editMode}
                  onClick={() => onRowClick(row)}
                >
                  {Object.keys(row).map((cell, index) => {
                    // console.log(cell)

                    if (cell === 'keystrokes') {
                      return (
                        <StyledTD key={`cell_${index}_${row[cell]}`}>
                          <DisplayShortcut shortcut={row[cell]} />{' '}
                        </StyledTD>
                      )
                    }
                    return <StyledTD key={`cell_${index}_${row[cell]}`}>{row[cell]}</StyledTD>
                  })}
                </StyledRow>
              )
            })}
          </StyledTBody>
        </StyledTable>
        <Modal
          className="ModalContent"
          overlayClassName="ModalOverlay"
          onRequestClose={() => setEditMode(false)}
          isOpen={editMode}
        >
          <InputShortcut />
        </Modal>
      </TableWrapperScrollable>
    </>
  )
}

export default ShortcutTable
