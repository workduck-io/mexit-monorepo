import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { Icon } from '@iconify/react'
import checkboxCircleLine from '@iconify-icons/ri/checkbox-circle-line'
import errorWarningLine from '@iconify-icons/ri/error-warning-line'
import lock2Line from '@iconify-icons/ri/lock-2-line'
import { useCombobox } from 'downshift'
import { useDebouncedCallback } from 'use-debounce'

import {
  convertContentToRawText,
  fuzzySearch,
  getMIcon,
  ILink,
  isClash,
  isReserved,
  MIcon,
  QuickLinkStatus,
  QuickLinkType,
  SEPARATOR,
  SHARED_NAMESPACE,
  SingleNamespace,
  useContentStore,
  useDataStore,
  useMetadataStore,
  useRecentsStore,
  userPreferenceStore as useUserPreferenceStore,
  useSnippetStore,
  withoutContinuousDelimiter
} from '@mexit/core'
import {
  DefaultMIcons,
  IconDisplay,
  Input,
  StyledCombobox,
  StyledCreatatbleSelect,
  StyledInputWrapper,
  StyledMenu,
  Suggestion,
  SuggestionContentWrapper,
  SuggestionDesc,
  SuggestionError,
  SuggestionText,
  SuggestionTextWrapper
} from '@mexit/shared'

import { useLinks } from '../../Hooks/useLinks'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useSearchExtra } from '../../Hooks/useSearch'
import { StyledNamespaceSelectComponents } from '../../Style/Select'
import NamespaceTag from '../NamespaceTag'

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
  namespace?: string

  icon?: MIcon
}

export const makeQuickLink = (
  title: string,
  options: { namespace?: string; nodeid: string; type?: QuickLinkType; icon?: MIcon }
): QuickLink => ({
  text: title,
  value: title,
  type: options.type ?? QuickLinkType.backlink,
  status: QuickLinkStatus.exists,
  nodeid: options.nodeid,
  icon: options.icon,
  namespace: options?.namespace
})

export const createNewQuickLink = (path: string, type: QuickLinkType = QuickLinkType.backlink): QuickLink => ({
  text: `Create new: ${path}`,
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
  /**
   * Whether to show menu as an overlay or inline
   * @default true
   */
  menuOverlay?: boolean

  menuOpen?: boolean
  /** If true, the combobox will be autofocused */
  autoFocus?: boolean
  /** If true, when autofocused, all text will be selected */
  autoFocusSelectAll?: boolean

  defaultValue?: {
    path: string
    namespace: string
  }
  placeholder?: string

  /** Show icon highlig‸ht for whether an option has been selected */
  highlightWhenSelected?: boolean

  /** disallow input if reserved */
  disallowReserved?: boolean

  /** disallow input if clash */
  disallowClash?: boolean

  /** disallow input if match  */
  disallowMatch?: (path: string) => boolean

  /** Which highlight to show, true for selected (check) */
  iconHighlight?: boolean

  /** Add the create option at the top of the suggestions */
  createAtTop?: boolean

  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

interface NodeSelectState {
  inputItems: QuickLink[]
  namespaces: SingleNamespace[]
  selectedItem: QuickLink | null
  selectedNamespace: SingleNamespace | null
  reserved: boolean
  clash: boolean
  isMatch: boolean
}
interface ReserveClashActionProps {
  path: string
  onReserve: (reserve: boolean) => void
  onClash: (clash: boolean) => void
  onMatch: (isMatch: boolean) => void
  onSuccess: () => void
}

/**
 * Select nodes for for a given path
 *
 * @param {NodeSelectProps} props
 */
function NodeSelect({
  autoFocus,
  autoFocusSelectAll,
  menuOpen,
  defaultValue,
  placeholder,
  showAll,
  disabled,
  highlightWhenSelected,
  iconHighlight,
  prefillRecent,
  disallowMatch,
  disallowReserved,
  disallowClash,
  handleSelectItem,
  handleCreateItem,
  createAtTop,
  onFocus,
  onBlur,
  id,
  name,
  menuOverlay = true
}: NodeSelectProps) {
  const [nodeSelectState, setNodeSelectState] = useState<NodeSelectState>({
    inputItems: [],
    namespaces: [],
    selectedItem: null,
    selectedNamespace: null,
    reserved: false,
    clash: false,
    isMatch: false
  })

  const { getSearchExtra } = useSearchExtra()
  const { getNamespaceOptions } = useNamespaces()

  const setInputItems = (inputItems: QuickLink[]) => setNodeSelectState((state) => ({ ...state, inputItems }))

  const setSelectedItem = (selectedItem: QuickLink | null) =>
    setNodeSelectState((state) => ({ ...state, selectedItem }))

  const setSelectedNamespace = (selectedNamespace: SingleNamespace | null) =>
    setNodeSelectState((state) => ({ ...state, selectedNamespace }))

  const { getPathFromNodeid, getNodeidFromPath } = useLinks()

  const getQuickLinks = () => {
    const ilinks = useDataStore.getState().ilinks
    const snippets = useSnippetStore.getState().snippets ?? {}
    const sharedNodes = useDataStore.getState().sharedNodes

    const fLinks = disallowReserved ? ilinks.filter((l) => !isReserved(l.path)) : ilinks

    const mLinks = fLinks.map((l) => makeQuickLink(l.path, { namespace: l.namespace, nodeid: l.nodeid, icon: l.icon }))

    const sLinks = sharedNodes.map((l) =>
      makeQuickLink(l.path, { namespace: SHARED_NAMESPACE.id, nodeid: l.nodeid, icon: DefaultMIcons.SHARED_NOTE })
    )

    if (!showAll) return mLinks

    const mSnippets = Object.values(snippets).map((s) =>
      makeQuickLink(s.title, { nodeid: s.id, type: QuickLinkType.snippet, icon: s.icon })
    )

    return [...mLinks, ...sLinks, ...mSnippets]
  }

  const reset = () =>
    setNodeSelectState((state) => ({
      ...state,
      inputItems: [],
      selectedItem: null,
      reserved: false,
      clash: false,
      isMatch: false
    }))

  const quickLinks = getQuickLinks()
  const { namespaces: namespaceOptions, defaultNamespace } = getNamespaceOptions()
  const namespaces = useDataStore((state) => state.namespaces)

  const lastOpened = useRecentsStore((store) => store.lastOpened)

  const lastOpenedItems = Array.from(lastOpened.notes)
    .reverse()
    .map((nodeid) => {
      const path = getPathFromNodeid(nodeid)
      const namespaceId = useDataStore.getState().ilinks.find((i) => i.nodeid === nodeid)?.namespace
      return makeQuickLink(path, { nodeid, namespace: namespaceId })
    })
    .filter((i) => i.text)

  const { inputItems, selectedItem } = nodeSelectState
  const searchExtra = useMemo(() => getSearchExtra(), [])
  const contents = useContentStore((store) => store.contents)
  const notesMetadata = useMetadataStore((s) => s.metadata.notes)

  const getNewItems = (inputValue: string) => {
    if (inputValue !== '' && inputValue !== undefined) {
      // mog('getNewItems', { inputValue, quickLinks })
      const newItems = fuzzySearch(quickLinks, inputValue, (item) => item.text)

      if (
        !isClash(
          inputValue,
          quickLinks.map((l) => l.value)
        )
      ) {
        // Change to value from namespaceselect

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

  // Do not remove highlight index when mouse leaves the menu
  const stateReducer = React.useCallback((state, actionAndChanges) => {
    const { type, changes } = actionAndChanges
    switch (type) {
      // Do not remove highlight index when mouse leaves the menu
      case useCombobox.stateChangeTypes.MenuMouseLeave: {
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex
        }
      }
      default:
        return changes // otherwise business as usual.
    }
  }, [])

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
    onHighlightedIndexChange: (args) => {
      const { highlightedIndex } = args
      const highlightedItem = inputItems[highlightedIndex]

      if (highlightedItem && highlightedItem.value) {
        setInputValue(highlightedItem.value)
        if (highlightedItem.namespace) {
          const ns = namespaceOptions.find((n) => n.id === highlightedItem.namespace)
          setSelectedNamespace(ns)
        }
      }
    },
    stateReducer
  })

  function handleSelectedItemChange({ selectedItem }: { selectedItem?: QuickLink }) {
    if (selectedItem) {
      const { key, isChild } = withoutContinuousDelimiter(selectedItem.value)

      if (key === '') return
      if (isChild) return

      onReverseClashAction({
        path: key,
        onSuccess: () => {
          if (selectedItem.status === QuickLinkStatus.new && key && !isChild) {
            setSelectedItem({ ...selectedItem, text: key, value: key })
            setInputValue(key)
            handleCreateItem({
              ...selectedItem,
              namespace: selectedItem.namespace ?? nodeSelectState.selectedNamespace?.id,
              text: key,
              value: key
            })
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
        },
        onMatch: () => {
          setInputValue(key)
          toast('Note itself cannot be used')
        }
      })
    }
  }

  const onFocusWithSelect = (e: React.FocusEvent<HTMLInputElement>) => {
    // mog('Focusing with select all1', { e, autoFocus })
    const timoutId = setTimeout(() => {
      if (autoFocus && autoFocusSelectAll) {
        // mog('Focusing with select all', { e, autoFocus })
        e.target.focus()
        e.target.select()
        e.target.setSelectionRange(0, e.target.value.length)
      }
    }, 300)
    onFocus && onFocus(e)
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
              handleCreateItem({
                ...quickLink,
                namespace: quickLink.namespace ?? nodeSelectState.selectedNamespace?.id
              })
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
          },
          onMatch: () => {
            toast('Note itself cannot be used')
            setInputValue('')
          }
        })
      }
    }
  }

  const onReverseClashAction = ({ path, onReserve, onClash, onSuccess, onMatch }: ReserveClashActionProps) => {
    if (!path) return
    const reserved = isReserved(path)
    const clash = isClash(
      path,
      quickLinks.map((i) => i.value)
    )

    const match = typeof disallowMatch === 'function' && disallowMatch(path)

    // Update if search is reserved/clash, or when reserved/clash is true
    if (
      ((reserved || nodeSelectState.reserved) && disallowReserved) ||
      ((clash || nodeSelectState.clash) && disallowClash) ||
      match ||
      nodeSelectState.isMatch
    ) {
      if (match || nodeSelectState.isMatch) {
        onMatch(match)
      } else if ((reserved || nodeSelectState.reserved) && disallowReserved) {
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

    if (!search) return
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
      },
      onMatch: (isMatch) => {
        setNodeSelectState({ ...nodeSelectState, inputItems: newItems, isMatch })
      }
    })
  }, 150)

  useEffect(() => {
    if (defaultValue) {
      const newItems = getNewItems(defaultValue.path)
      const nodeid = getNodeidFromPath(defaultValue.path, defaultValue.namespace)
      onReverseClashAction({
        path: defaultValue.path,
        onSuccess: () => {
          setInputItems(newItems)
          setInputValue(defaultValue.path)
          setSelectedItem(makeQuickLink(defaultValue.path, { nodeid, namespace: defaultValue.namespace }))
        },
        onReserve: (reserved) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, reserved })
          setInputValue(defaultValue.path)
        },
        onClash: (clash) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, clash })
          setInputValue(defaultValue.path)
        },
        onMatch: (isMatch) => {
          setNodeSelectState({ ...nodeSelectState, inputItems, isMatch })
          setInputValue(defaultValue.path)
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

  const highlightedItem = inputItems[highlightedIndex]

  const getRelevantNamespace = () => {
    const activeNamespaceId = useUserPreferenceStore.getState().activeNamespace
    const activeNamespace = namespaceOptions.find((n) => n.id === activeNamespaceId)

    return activeNamespace ?? defaultNamespace
  }

  const showNamespaceSelect = highlightedItem && highlightedItem.status === QuickLinkStatus.new
  const namespaceSelectValue = nodeSelectState.selectedNamespace ?? getRelevantNamespace()

  // mog('NodeSelect Data', {
  //   inputItems,
  //   highlightedIndex,
  //   highlightedItem,
  //   selectedItem,
  //   showNamespaceSelect,
  //   namespaceSelectValue,
  //   nodeSelectState
  // })

  return (
    <StyledInputWrapper isOverlay={menuOverlay}>
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
          onFocus={onFocusWithSelect}
          onBlur={onBlur}
        />
        {showNamespaceSelect && (
          <StyledCreatatbleSelect
            // isMulti
            // isCreatable
            onChange={(selected) => {
              // mog('Selected', selected)
              if (selected && highlightedItem && highlightedItem.status === QuickLinkStatus.new) {
                setSelectedNamespace(selected)
                handleSelectedItemChange({ selectedItem: { ...highlightedItem, namespace: selected.id } })
              }
            }}
            value={namespaceSelectValue}
            options={namespaceOptions}
            closeMenuOnSelect={true}
            closeMenuOnBlur={false}
            components={StyledNamespaceSelectComponents}
          />
        )}
        {highlightWhenSelected &&
          (iconHighlight ? (
            <Icon className="okayIcon" icon={checkboxCircleLine}></Icon>
          ) : (
            <Icon className="errorIcon" icon={errorWarningLine}></Icon>
          ))}
      </StyledCombobox>
      <StyledMenu {...getMenuProps()} isOverlay={menuOverlay} isOpen={isOpen}>
        {disallowReserved && nodeSelectState.reserved ? (
          <SuggestionError>
            <Icon width={18} icon={lock2Line} />
            {nodeSelectState.reserved && (
              <SuggestionContentWrapper>
                <SuggestionText>Warning: Reserved Note</SuggestionText>
                <SuggestionDesc>Reserved Notes cannot be used!</SuggestionDesc>
                <SuggestionDesc>However, Children inside reserved notes can be used.</SuggestionDesc>
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
                  if (content) desc = convertContentToRawText(content.content, ' ', { extra: searchExtra })
                  if (desc === '') desc = undefined
                }

                const icon = notesMetadata[item.nodeid]?.icon ?? DefaultMIcons.NOTE
                const namespace = namespaces?.find((n) => n.id === item?.namespace)
                if (nodeSelectState.clash && disallowClash && item.status === QuickLinkStatus.new) return null

                return (
                  <Suggestion
                    highlight={highlightedIndex === index}
                    key={`${item.value}${index}`}
                    center={!desc}
                    {...getItemProps({ item, index })}
                  >
                    <IconDisplay
                      className="mexit-list-item"
                      size={18}
                      icon={item.status === QuickLinkStatus.new ? getMIcon('ICON', 'ri:add-circle-line') : icon}
                    />
                    <SuggestionContentWrapper>
                      <SuggestionTextWrapper>
                        <SuggestionText>{item.text}</SuggestionText>
                        <NamespaceTag namespace={namespace} />
                      </SuggestionTextWrapper>
                      {desc && <SuggestionDesc>{desc}</SuggestionDesc>}
                    </SuggestionContentWrapper>
                  </Suggestion>
                )
              })}
          </>
        )}
      </StyledMenu>
    </StyledInputWrapper>
  )
}

NodeSelect.defaultProps = {
  menuOpen: false,
  autoFocus: false,
  placeholder: 'Select Note',
  handleCreateItem: undefined,
  highlightWhenSelected: false,
  iconHighlight: false,
  prefillRecent: false
}

export function isNew(input: string, items: Array<QuickLink>): boolean {
  const ti = input.trim()
  return items.filter((item) => item.text === ti).length === 0 && ti !== '' && !ti.startsWith(SEPARATOR)
}

export const isNewILink = (input: string, items: Array<ILink>): boolean => {
  return items.filter((item) => item.path === input).length === 0
}

export default NodeSelect

export const WrappedNodeSelect = (props: NodeSelectProps) => <NodeSelect {...props} />
