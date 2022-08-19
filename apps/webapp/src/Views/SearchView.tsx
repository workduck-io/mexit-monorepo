import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react'

import searchLine from '@iconify-icons/ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'

import { tinykeys } from '@workduck-io/tinykeys'

import { mog, SearchFilter } from '@mexit/core'
import {
  InputWrapper,
  NoSearchResults,
  Results,
  ResultsWrapper,
  SearchHeader,
  SearchInput,
  SearchViewContainer,
  View
} from '@mexit/shared'

import { useFilters, useFilterStore } from '../Hooks/useFilters'
import SplitView, { RenderSplitProps, SplitOptions, SplitType } from './SplitView'
import ViewSelector from './ViewSelector'

interface SearchViewState<Item> {
  selected: number
  searchTerm: string
  result: Item[]
  view: View
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

  view?: View
  onClick?: React.MouseEventHandler
  onMouseEnter?: React.MouseEventHandler
}

// export interface SearchViewStoreState<Item> extends SearchViewState<Item> {
//   setSelected: (selected: number) => void
//   setResult: (result: Item[], searchTerm: string) => void
//   setView: (view: View) => void
//   clearSearch: () => void
// }

// export const useSearchStore = <Item, Slice>(selector: (state: SearchViewStoreState<Item>) => Slice) =>
//   useSearchStoreBase(selector)

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
  view: View
}

interface SearchViewProps<Item> {
  /**
   * The ID for the view
   */
  id: string
  /**
   * The initial items to display
   */
  initialItems: Item[]

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
  onSelect: (item: Item) => void

  /**
   * On search result update, the filterResults is called to get the filtered results
   * Maintain your external state for the filters
   * @param results Results to filter
   */
  filterResults?: (result: Item[]) => Item[]

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
  RenderItem: (props: RenderItemProps<Item>) => JSX.Element

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
}

/**
 * Search Interface
 */
const SearchView = <Item,>({
  id,
  initialItems,
  // views,
  onSearch,
  onSelect,
  onEscapeExit,
  getItemKey,
  filterResults,
  RenderItem,
  RenderPreview,
  RenderNotFound,
  RenderStartCard,
  RenderFilters,
  options
}: SearchViewProps<Item>) => {
  const [searchState, setSS] = useState<SearchViewState<Item>>({
    selected: -1,
    searchTerm: '',
    result: [],
    view: options?.view ?? View.List
  })
  const { applyCurrentFilters, resetCurrentFilters } = useFilters<Item>()
  const currentFilters = useFilterStore((store) => store.currentFilters) as SearchFilter<Item>[]
  const filters = useFilterStore((store) => store.filters) as SearchFilter<Item>[]
  const setSelected = (selected: number) => setSS((s) => ({ ...s, selected }))
  const setView = (view: View) => {
    mog('setview', { view })
    setSS((s) => ({ ...s, view }))
  }
  const setOnlyResult = (result: Item[]) => {
    setSS((s) => ({ ...s, result }))
  }
  const setResult = (result: Item[], searchTerm: string) => {
    mog('setresult', { result, searchTerm })

    setSS((s) => ({ ...s, result, searchTerm, selected: -1 }))
  }
  const clearSearch = () => setSS((s) => ({ ...s, result: [], searchTerm: '', selected: -1 }))
  const { selected, searchTerm, result, view } = searchState

  const inpRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mog('Setting View', { view, id })
    if (options?.view) {
      setView(options.view)
    }
  }, [options?.view])

  useEffect(() => {
    mog('clearing search on ID change', { searchTerm, id })
    clearSearch()
  }, [id])

  const executeSearch = async (newSearchTerm: string) => {
    if (newSearchTerm === '' && initialItems.length > 0) {
      const filtered = filterResults ? filterResults(initialItems) : initialItems
      setResult(filtered, newSearchTerm)
    } else {
      const res = await onSearch(newSearchTerm)
      const filtered = filterResults ? filterResults(res) : res
      setResult(filtered, newSearchTerm)
    }
  }

  const updateResults = useMemo(
    () => () => {
      // mog('SearchFiltersUpdate', { result, currentFilters })
      // const results = applyCurrentFilters(result)
      mog('updating results', { result, currentFilters })
      // setOnlyResult(results)
      executeSearch(searchTerm)
    },
    [currentFilters, result]
  )

  useEffect(() => {
    updateResults()
  }, [currentFilters])

  useEffect(() => {
    executeSearch(searchTerm)
    return () => {
      mog('clearing search', { searchTerm })
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
    const newSelected = (selected + 1) % result.length
    if (result.length === 0 || (result.length === 1 && selected === newSelected)) return
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
        event.preventDefault()

        resetCurrentFilters()
        if (inpRef.current) {
          if (inpRef.current.value !== '') {
            inpRef.current.value = ''
            if (selected > -1) {
              setSelected(-1)
            }
          } else {
            onEscapeExit()
          }
        }
      },
      Tab: (event) => {
        event.preventDefault()
        // Blur the input if necessary (not needed currently)
        // if (inputRef.current) inputRef.current.blur()
        if (event.shiftKey) {
          selectPrev()
        } else {
          selectNext()
        }
      },
      ArrowDown: (event) => {
        event.preventDefault()
        selectNext()
      },

      ArrowUp: (event) => {
        event.preventDefault()
        selectPrev()
      },

      Enter: (event) => {
        // Only when the selected index is -1
        if (selected > -1) {
          onSelect(result[selected] as Item)
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [result, selected])

  // onKeyDown handler function
  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // mog('keyDownHandler', { code: event.code })
    if (event.code === 'Escape') {
      // setInput()
    }
  }

  const splitOptions = options?.splitOptions ?? {
    type: selected > -1 ? SplitType.SIDE : SplitType.NONE,
    percent: 50
  }

  const ResultsView = (
    <Results key={`ResultForSearch_${id}`} view={view}>
      {view === View.Card && RenderStartCard && <RenderStartCard />}
      {result?.map((c, i) => {
        return (
          <RenderItem
            view={view}
            item={c}
            onMouseEnter={(e) => {
              e.preventDefault()
              if (selected !== i) setSelected(i)
            }}
            onClick={() => {
              onSelect(c)
            }}
            splitOptions={splitOptions}
            selected={i === selected}
            ref={i === selected ? selectedRef : null}
            id={`ResultForSearch_${getItemKey(c)}`}
            key={`ResultForSearch_${getItemKey(c)}`}
          />
        )
      })}
    </Results>
  )

  // mog('SearchContainer', { options, result, id, selected, view })
  return (
    <SearchViewContainer key={id} id={id} onKeyDown={keyDownHandler}>
      <SearchHeader>
        <InputWrapper>
          <Icon icon={searchLine} />
          <SearchInput
            autoFocus
            id={`search_nodes_${id}`}
            name="search_nodes"
            tabIndex={-1}
            placeholder={options?.inputPlaceholder ?? 'Search Anything....'}
            type="text"
            defaultValue={searchTerm}
            onChange={debounce((e) => onChange(e), 250)}
            onFocus={() => {
              if (inpRef.current) inpRef.current.select()
            }}
            ref={inpRef}
          />
        </InputWrapper>
        {!options?.view && (
          <ViewSelector
            currentView={view}
            onChangeView={(view) => {
              setView(view)
            }}
          />
        )}
      </SearchHeader>

      {RenderFilters && filters.length > 0 ? <RenderFilters result={result} /> : null}

      <ResultsWrapper>
        {result?.length > 0 ? (
          view === View.List && RenderPreview && options?.splitOptions?.type !== SplitType.NONE ? (
            <SplitView
              id={`SplitViewForSearch_${id}`}
              RenderSplitPreview={(props) => (
                <RenderPreview {...props} item={selected > -1 ? result[selected] : undefined} />
              )}
              splitOptions={splitOptions}
            >
              {ResultsView}
            </SplitView>
          ) : (
            ResultsView
          )
        ) : RenderNotFound ? (
          <RenderNotFound />
        ) : (
          <NoSearchResults>
            {options?.noResults ?? 'No results found. Try refining the query or search for a different one.'}
          </NoSearchResults>
        )}
      </ResultsWrapper>
    </SearchViewContainer>
  )
}

export default SearchView
