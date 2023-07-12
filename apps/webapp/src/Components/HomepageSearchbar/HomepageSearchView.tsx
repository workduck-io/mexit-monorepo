import React, { RefObject, useEffect, useMemo, useRef } from 'react'

import { Icon } from '@iconify/react'
import filter2Line from '@iconify-icons/ri/filter-2-line'
import searchLine from '@iconify-icons/ri/search-line'
import { debounce } from 'lodash'

import { Button, PrimaryButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { Filter, Filters, GlobalFilterJoin, idxKey, mog, ViewType } from '@mexit/core'
import {
  FilterNumber,
  HomepageSearchHeader,
  HomepageSearchInput,
  InputWrapper,
  SearchViewContainer
} from '@mexit/shared'

import { useEnableShortcutHandler } from '../../Hooks/useChangeShortcutListener'
import { RenderSplitProps, SplitOptions } from '../../Views/SplitView'

interface SearchViewState<Item> {
  selected: number
  searchTerm: string
  result: Item[]
}

export interface RenderPreviewProps<Item> extends RenderSplitProps {
  item?: Item
}

export interface RenderFilterProps<Item> {
  result: Item[]
}

// export interface RenderStartCard extends RenderSplitProps {}

export interface RenderItemProps<Item> extends Partial<RenderSplitProps> {
  item: Item
  selected: boolean
  ref: RefObject<HTMLDivElement>
  key: string
  id: string

  view?: ViewType
  onClick?: React.MouseEventHandler
  onMouseEnter?: React.MouseEventHandler
}

interface IndexGroups {
  [key: string]: idxKey[]
}

interface SearchOptions {
  /**
   * Message to display when no results are found
   * Overridden by RenderNotFound if provided
   */
  noResults: string

  /** Message to display in search input */
  inputPlaceholder: string

  /** TODO: Planned features*/

  splitOptions: SplitOptions
  /** show preview */
  // preview: boolean
  /** animation enabled/disabled */
  // animation: boolean

  /** View to show in search */
  /** If none specified all are used */
  view: ViewType
}

interface SearchViewProps<Item> {
  setShowrecents?: (show: boolean) => void
  showFilters?: boolean
  setShowFilters?: (show: boolean) => void
  isHomepage?: boolean
  /**
   * The ID for the view
   */
  id: string
  /**
   * The initial items to display
   */
  initialItems: Item[] | { [indexGroupKey: string]: Item[] }

  /**
   * Get next resut for current search term
   * @param item Item to render
   * @param index Index of the item
   * @param view View to render
   */
  onSearch: (searchTerm: string) => Promise<Item[]>

  /**
   * Handle select item
   * @param item - The selected item
   */
  onSelect: (item: Item, e?: React.MouseEvent<Element>) => void

  /**
   * Handle delete keypress on selected item
   * @param item - The selected item
   */
  onDelete?: (item: Item) => void

  filterActions?: {
    filters: Filters
    resetCurrentFilters?: () => void
    currentFilters: Filter[]
    globalJoin: GlobalFilterJoin
  }

  /**
   * IndexeGroups
   *
   * Default key of index groups to show initially
   */
  indexes?: { indexes: IndexGroups; default: string }

  /**
   * Handle select item
   * @param item - The selected item
   */
  getItemKey: (item: Item) => string

  /**
   * When the search term is empty and escape is pressed
   * @param item - The selected item
   */
  onEscapeExit: () => void

  /**
   * Render a single item
   * @param item - Item to render
   */
  RenderItem?: (props: RenderItemProps<Item>) => JSX.Element

  /**
   * Render Preview of the selected item in list view
   * @param item - Selected Item
   */
  RenderPreview?: (props: RenderPreviewProps<Item>) => JSX.Element

  /**
   * Render a single item
   * @param item Item to render
   */
  RenderNotFound?: () => JSX.Element

  /**
   * Render a single item
   * @param item Item to render
   */
  RenderFilters?: (props: RenderFilterProps<Item>) => JSX.Element

  /**
   * Render Preview of the selected item in list view
   * @param item - Selected Item
   */
  RenderStartCard?: () => JSX.Element

  /**
   * Search Options
   */
  options?: Partial<SearchOptions>

  searchState?: SearchViewState<Item>

  setSS: (s: any) => void
}

/**
 * Search Interface
 */
const HomepageSearchView = <Item,>({
  id,
  initialItems,
  indexes,
  onSearch,
  onSelect,
  onDelete,
  RenderFilters,
  showFilters,
  setShowFilters,
  setShowrecents,
  options = { view: ViewType.List },
  filterActions,
  searchState,
  setSS
}: SearchViewProps<Item>) => {
  const { filters, currentFilters, globalJoin } = useMemo(
    () =>
      filterActions ?? {
        filters: [],
        currentFilters: [],
        globalJoin: 'all'
      },
    [filterActions]
  )

  const setSelected = (selected: number) => setSS((s) => ({ ...s, selected }))
  const { enableShortcutHandler } = useEnableShortcutHandler()

  const setResult = (result: Item[], searchTerm: string) => {
    setSS((s) => ({ ...s, result, searchTerm, selected: -1 }))
  }

  const clearSearch = () => {
    setSS((s) => ({ ...s, result: [], searchTerm: '', selected: -1 }))
  }
  const { selected, searchTerm, result } = searchState

  const inpRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    clearSearch()
  }, [id])

  const executeSearch = async (newSearchTerm: string) => {
    if (newSearchTerm === '' && currentFilters?.length === 0) {
      // const curIndexGroup = findCurrentIndex()
      const initItems = []

      if (initItems?.length > 0 || currentFilters.length > 0) {
        setResult([], newSearchTerm)
        setShowrecents(false)
      } else setShowrecents(true)
    } else {
      const res = await onSearch(newSearchTerm)
      mog('ExecuteSearch - onNew', { newSearchTerm, currentFilters, res })
      setResult(res, newSearchTerm)
      setShowrecents(false)
    }
  }

  const updateResults = useMemo(
    () => () => {
      executeSearch(searchTerm)
    },
    [currentFilters, result, initialItems]
  )

  useEffect(() => {
    updateResults()
  }, [currentFilters, initialItems])

  useEffect(() => {
    executeSearch(searchTerm)
    return () => {
      clearSearch()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedRef.current) {
      const el = selectedRef.current
      // is element in viewport
      const rect = el.getBoundingClientRect()
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

      // mog('scroll to selected', { selected, top, isInViewport, rect })
      if (!isInViewport) {
        selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [selected])

  const selectNext = () => {
    const newSelected = (selected + 1) % result?.length
    if (result?.length === 0 || (result?.length === 1 && selected === newSelected)) return
    setSelected(newSelected)
  }

  const selectPrev = () => {
    const newSelected = (result.length + selected - 1) % result.length
    if (result.length === 0 || (result.length === 1 && selected === newSelected)) return
    // mog('selectPrev', { selected, result, newSelected })
    setSelected(newSelected)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (e: any) => {
    e.preventDefault()
    const inpSearchTerm = e.target.value
    executeSearch(inpSearchTerm)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        enableShortcutHandler(() => {
          event.preventDefault()
          event.stopPropagation()
          if (inpRef.current) {
            if (inpRef.current.value !== '') {
              inpRef.current.value = ''
              executeSearch('')
              if (selected > -1) {
                setSelected(-1)
              }
            }
          }
        })
      },
      KeyF: (event) => {
        if (!RenderFilters) {
          event.preventDefault()

          inpRef.current?.focus()
        }
      },
      // Tab: (event) => {
      //   enableShortcutHandler(() => {
      //     // Blur the input if necessary (not needed currently)
      //     // if (inputRef.current) inputRef.current.blur()
      //     event.preventDefault()
      //     if (event.shiftKey) {
      //       selectPrev()
      //     } else {
      //       selectNext()
      //     }
      //   })
      // },
      ArrowDown: (event) => {
        // event.preventDefault()
        enableShortcutHandler(selectNext, { ignoreClasses: 'dropdown', skipLocal: false })
      },

      ArrowUp: (event) => {
        enableShortcutHandler(selectPrev, { ignoreClasses: 'dropdown', skipLocal: false })
      },

      Enter: (event) => {
        // Only when the selected index is -1
        enableShortcutHandler(
          () => {
            if (selected > -1) {
              onSelect(result[selected] as Item)
            }
          },
          { ignoreClasses: 'dropdown', skipLocal: false }
        )
      },

      Delete: (event) => {
        // Only when the selected index is -1
        enableShortcutHandler(
          () => {
            if (selected > -1) {
              onDelete(result[selected] as Item)
              setSelected(-1)
            }
          },
          { ignoreClasses: 'dropdown', skipLocal: false }
        )
      }
    })
    return () => {
      unsubscribe()
    }
  }, [result, currentFilters, selected, initialItems])

  return (
    <SearchViewContainer key={id} id={id}>
      <HomepageSearchHeader>
        <InputWrapper>
          <Icon icon={searchLine} fontSize={20} style={{ marginLeft: '10px' }} />
          <HomepageSearchInput
            id={`search_nodes_${id}`}
            name="search_nodes"
            tabIndex={-1}
            placeholder={options?.inputPlaceholder ?? 'Find Anything....'}
            type="text"
            defaultValue={searchTerm}
            onChange={debounce((e) => onChange(e), 250)}
            className="mex-search-input"
            onFocus={() => {
              if (inpRef.current) inpRef.current.select()
            }}
            ref={inpRef}
          />
        </InputWrapper>

        {showFilters ? (
          <Button
            large
            onClick={() => {
              setShowFilters?.(!showFilters)
            }}
          >
            <Icon icon={filter2Line} fontSize={20} />
            Hide Filters
            {currentFilters?.length > 0 && <FilterNumber> {currentFilters.length}</FilterNumber>}
          </Button>
        ) : (
          <PrimaryButton
            large
            onClick={() => {
              setShowFilters?.(!showFilters)
            }}
          >
            <Icon icon={filter2Line} fontSize={20} />
            Show Filters
            {currentFilters?.length > 0 && <FilterNumber> {currentFilters.length}</FilterNumber>}
          </PrimaryButton>
        )}
      </HomepageSearchHeader>

      {showFilters && RenderFilters && filters?.length > 0 ? <RenderFilters result={result} /> : null}
    </SearchViewContainer>
  )
}

export default HomepageSearchView
