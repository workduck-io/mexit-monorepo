import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import addCircleLine from '@iconify-icons/ri/add-circle-line'
import checkboxCircleLine from '@iconify-icons/ri/checkbox-circle-line'
import errorWarningLine from '@iconify-icons/ri/error-warning-line'
import { useDebouncedCallback } from 'use-debounce'
import lock2Line from '@iconify-icons/ri/lock-2-line'
import { useCombobox } from 'downshift'
import toast from 'react-hot-toast'
import fileList2Line from '@iconify-icons/ri/file-list-2-line'
import { withoutDelimiter } from '@workduck-io/mex-editor'

import { mog } from '@mexit/shared'

import { ILink } from '../../Types/Data'
import { Input } from '../../Style/Form'
import { isClash, isReserved } from '../../Utils/path'
import { parseBlock } from '../../Utils/flexsearch'
import { fuzzySearch } from '../../Utils/fuzzysearch'
import useContentStore from '../../Stores/useContentStore'
import useDataStore from '../../Stores/useDataStore'
import { useLinks } from '../../Hooks/useLinks'
import { useRecentsStore } from '../../Stores/useRecentsStore'
import {
  StyledCombobox,
  StyledInputWrapper,
  StyledMenu,
  Suggestion,
  SuggestionContentWrapper,
  SuggestionDesc,
  SuggestionError,
  SuggestionText
} from './NodeSelect.styles'

export type QuickLink = {
  // Text to be shown in the combobox list
  text: string

  // Value of the item. In this case NodeId
  value: string

  // Does it 'exist' or is it QuickLinkStatus.new
  status: QuickLinkStatus

  type?: QuickLinkType

  // Unique identifier
  // Not present if the node is not yet created i.e. QuickLinkStatus.new
  nodeid?: string

  icon?: string
}

export enum QuickLinkType {
  ilink,
  flow
}

enum QuickLinkStatus {
  new,
  exists
}

export const makeQuickLink = (
  title: string,
  options: { nodeid: string; type?: QuickLinkType; icon?: string }
): QuickLink => ({
  text: title,
  value: title,
  type: options.type ?? QuickLinkType.ilink,
  status: QuickLinkStatus.exists,
  nodeid: options.nodeid,
  icon: options.icon
})

export const createNewQuickLink = (path: string, type: QuickLinkType = QuickLinkType.ilink): QuickLink => ({
  text: `Create New: ${path}`,
  value: path,
  type,
  status: QuickLinkStatus.new
})

interface NodeSelectProps {
  handleSelectItem: (item: QuickLink) => void
  handleCreateItem?: (item: QuickLink) => void
  id?: string
  name?: string
  disabled?: boolean
  inputRef?: any
  showAll?: boolean
  prefillRecent?: boolean
  menuOpen?: boolean
  autoFocus?: boolean
  defaultValue?: string | undefined
  placeholder?: string

  /** Show icon highlig‸ht for whether an option has been selected */
  highlightWhenSelected?: boolean

  /** disallow input if reserved */
  disallowReserved?: boolean

  /** disallow input if clash */
  disallowClash?: boolean

  /** Which highlight to show, true for selected (check) */
  iconHighlight?: boolean

  /** Add the create option at the top of the suggestions */
  createAtTop?: boolean

  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

interface NodeSelectState {
  inputItems: QuickLink[]
  selectedItem: QuickLink | null
  reserved: boolean
  clash: boolean
}
interface ReserveClashActionProps {
  path: string
  onReserve: (reserve: boolean) => void
  onClash: (clash: boolean) => void
  onSuccess: () => void
}

function NodeSelect({
  autoFocus,
  menuOpen,
  defaultValue,
  placeholder,
  showAll,
  disabled,
  highlightWhenSelected,
  iconHighlight,
  prefillRecent,
  disallowReserved,
  disallowClash,
  handleSelectItem,
  handleCreateItem,
  createAtTop,
  onFocus,
  onBlur,
  id,
  name
}: NodeSelectProps) {
  const [nodeSelectState, setNodeSelectState] = useState<NodeSelectState>({
    inputItems: [],
    selectedItem: null,
    reserved: false,
    clash: false
  })

  const setInputItems = (inputItems: QuickLink[]) => setNodeSelectState((state) => ({ ...state, inputItems }))

  const setSelectedItem = (selectedItem: QuickLink | null) =>
    setNodeSelectState((state) => ({ ...state, selectedItem }))

  const { getNodeIdFromUid, getUidFromNodeId } = useLinks()

  const getQuickLinks = () => {
    const ilinks = useDataStore.getState().ilinks

    const fLinks = disallowReserved ? ilinks.filter((l) => !isReserved(l.path)) : ilinks

    const mLinks = fLinks.map((l) => makeQuickLink(l.path, { nodeid: l.nodeid, icon: l.icon }))

    if (!showAll) return mLinks

    return [...mLinks]
  }

  const reset = () =>
    setNodeSelectState({
      inputItems: [],
      selectedItem: null,
      reserved: false,
      clash: false
    })

  const quickLinks = getQuickLinks()

  const lastOpened = useRecentsStore((store) => store.lastOpened)

  const lastOpenedItems = Array.from(lastOpened)
    .reverse()
    .map((nodeid) => {
      const path = getNodeIdFromUid(nodeid)
      return makeQuickLink(path, { nodeid })
    })
    .filter((i) => i.text)

  const { inputItems, selectedItem } = nodeSelectState
  const contents = useContentStore((store) => store.contents)

  const getNewItems = (inputValue: string) => {
    // const newItems =  ilinks.filter((item) => item.text.toLowerCase().startsWith(inputValue.toLowerCase()))
    // mog('Slelected', { inputValue })

    if (inputValue !== '') {
      const newItems = fuzzySearch(quickLinks, inputValue, { keys: ['text'] })
      if (
        !isClash(
          inputValue,
          quickLinks.map((l) => l.value)
        )
      ) {
        if (handleCreateItem && isNew(inputValue, quickLinks) && !isReserved(inputValue)) {
          const comboItem = createNewQuickLink(inputValue)
          if (createAtTop) {
            newItems.unshift(comboItem)
          } else newItems.push(comboItem)
        }
      }
      return newItems
    } else {
      return quickLinks
    }
  }

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    setInputValue,
    getItemProps,
    closeMenu
    // toggleMenu
  } = useCombobox({
    items: inputItems,
    selectedItem,
    initialIsOpen: menuOpen,
    itemToString: (item) => {
      return item ? item.value : ''
    },
    onSelectedItemChange: handleSelectedItemChange,
    onHighlightedIndexChange: ({ highlightedIndex }) => {
      const highlightedItem = inputItems[highlightedIndex]
      if (highlightedItem && highlightedItem.value) {
        setInputValue(highlightedItem.value)
      }
    }
  })

  function handleSelectedItemChange({ selectedItem }: { selectedItem?: QuickLink }) {
    if (selectedItem) {
      const { key, isChild } = withoutDelimiter(selectedItem.value)
      mog('Handling the selected item change', { selectedItem, key, isChild })

      onReverseClashAction({
        path: key,
        onSuccess: () => {
          if (selectedItem.status === QuickLinkStatus.new && key && !isChild) {
            setSelectedItem({ ...selectedItem, text: key, value: key })
            setInputValue(key)
            handleCreateItem({ ...selectedItem, text: key, value: key })
          } else {
            setSelectedItem(selectedItem)
            setInputValue(selectedItem.value)
            handleSelectItem(selectedItem)
          }
          closeMenu()
        },
        onReserve: () => {
          setInputValue(key)
          toast('Reserve node cannot be used')
        },
        onClash: () => {
          setInputValue(key)
          toast('Existing node cannot be used')
        }
      })
    }
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (inputItems[0] && highlightedIndex < 0 && selectedItem === null && isOpen) {
        const quickLink: QuickLink = inputItems[0]
        onReverseClashAction({
          path: quickLink.value,
          onSuccess: () => {
            setInputValue(quickLink.value)
            setSelectedItem(quickLink)
            if (quickLink.status === QuickLinkStatus.new) {
              handleCreateItem(quickLink)
            } else {
              handleSelectItem(quickLink)
            }
            closeMenu()
          },
          onReserve: () => {
            toast('Reserve node cannot be used')
            setInputValue('')
          },
          onClash: () => {
            toast('Existing node cannot be used')
            setInputValue('')
          }
        })
      }
    }
  }

  const onReverseClashAction = ({ path, onReserve, onClash, onSuccess }: ReserveClashActionProps) => {
    const reserved = isReserved(path)
    const clash = isClash(
      path,
      quickLinks.map((i) => i.value)
    )

    // Update if search is reserved/clash, or when reserved/clash is true
    if (
      ((reserved || nodeSelectState.reserved) && disallowReserved) ||
      ((clash || nodeSelectState.clash) && disallowClash)
    ) {
      if ((reserved || nodeSelectState.reserved) && disallowReserved) {
        onReserve(reserved)
      } else if ((clash || nodeSelectState.clash) && disallowClash) {
        onClash(clash)
      }
    } else {
      onSuccess()
    }
  }

  const onInpChange = useDebouncedCallback((e) => {
    const search = e.target.value
    const newItems = getNewItems(search)

    // mog('onInpChange', { search, newItems })

    // Update if search is reserved/clash, or when reserved is true
    onReverseClashAction({
      path: search,
      onSuccess: () => {
        setInputItems(newItems)
      },
      onReserve: (reserved) => {
        setNodeSelectState({ ...nodeSelectState, inputItems, reserved })
      },
      onClash: (clash) => {
        setNodeSelectState({ ...nodeSelectState, inputItems, clash })
      }
    })
  }, 150)

  useEffect(() => {
    if (defaultValue) {
      const newItems = getNewItems(defaultValue)
      const nodeid = getUidFromNodeId(defaultValue)
      onReverseClashAction({
        path: defaultValue,
        onSuccess: () => {
          setInputItems(newItems)
          setInputValue(defaultValue)
          setSelectedItem(makeQuickLink(defaultValue, { nodeid }))
        },
        onReserve: (reserved) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, reserved })
          setInputValue(defaultValue)
        },
        onClash: (clash) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, clash })
          setInputValue(defaultValue)
        }
      })
    } else {
      if (prefillRecent && lastOpenedItems.length > 0) {
        setInputItems(lastOpenedItems.filter((i) => i.text))
      } else {
        setInputItems(quickLinks)
      }
    }
    return () => {
      reset()
    }
  }, [defaultValue])

  return (
    <>
      <StyledCombobox {...getComboboxProps()}>
        <Input
          disabled={disabled}
          {...getInputProps()}
          autoFocus={autoFocus}
          placeholder={placeholder}
          id={id}
          name={name}
          onChange={(e) => {
            getInputProps().onChange(e)
            onInpChange(e)
          }}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {highlightWhenSelected &&
          (iconHighlight ? (
            <Icon className="okayIcon" icon={checkboxCircleLine}></Icon>
          ) : (
            <Icon className="errorIcon" icon={errorWarningLine}></Icon>
          ))}
      </StyledCombobox>
      <StyledMenu {...getMenuProps()} isOpen={isOpen}>
        {disallowReserved && nodeSelectState.reserved ? (
          <SuggestionError>
            <Icon width={24} icon={lock2Line} />
            {nodeSelectState.reserved && (
              <SuggestionContentWrapper>
                <SuggestionText>Warning: Reserved Node</SuggestionText>
                <SuggestionDesc>Reserved Nodes cannot be used!</SuggestionDesc>
                <SuggestionDesc>However, Children inside reserved nodes can be used.</SuggestionDesc>
              </SuggestionContentWrapper>
            )}
          </SuggestionError>
        ) : (
          <>
            {isOpen &&
              inputItems.map((item, index) => {
                let desc: undefined | string = undefined
                if (item.status !== QuickLinkStatus.new) {
                  const content = contents[item.nodeid]
                  if (content) desc = parseBlock(content.content, ' ')
                  if (desc === '') desc = undefined
                }
                const icon = item.icon ? item.icon : fileList2Line
                if (nodeSelectState.clash && disallowClash && item.status === QuickLinkStatus.new) return null
                return (
                  <Suggestion
                    highlight={highlightedIndex === index}
                    key={`${item.value}${index}`}
                    {...getItemProps({ item, index })}
                  >
                    <Icon width={24} icon={item.status === QuickLinkStatus.new ? addCircleLine : icon} />
                    <SuggestionContentWrapper>
                      <SuggestionText>{item.text}</SuggestionText>
                      {desc !== undefined && <SuggestionDesc>{desc}</SuggestionDesc>}
                    </SuggestionContentWrapper>
                  </Suggestion>
                )
              })}
          </>
        )}
      </StyledMenu>
    </>
  )
}

NodeSelect.defaultProps = {
  menuOpen: false,
  autoFocus: false,
  placeholder: 'Select Node',
  handleCreateItem: undefined,
  highlightWhenSelected: false,
  iconHighlight: false,
  prefillRecent: false
}

export function isNew(input: string, items: Array<QuickLink>): boolean {
  return items.filter((item) => item.text === input).length === 0
}

export const isNewILink = (input: string, items: Array<ILink>): boolean => {
  return items.filter((item) => item.path == input).length === 0
}

export default NodeSelect

export const WrappedNodeSelect = (props: NodeSelectProps) => (
  <StyledInputWrapper>
    <NodeSelect {...props} />
  </StyledInputWrapper>
)
