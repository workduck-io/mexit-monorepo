import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { Icon } from '@iconify/react'
import searchLine from '@iconify-icons/ri/search-line'
import { debounce } from 'lodash'

import { tinykeys } from '@workduck-io/tinykeys'

import { Filter, Filters, GlobalFilterJoin, idxKey, mog } from '@mexit/core'
import {
  InputWrapper,
  NoSearchResults,
  Results,
  ResultsWrapper,
  SearchHeader,
  SearchInput,
  SearchViewContainer,
  ViewType
} from '@mexit/shared'

import SearchIndexInput from '../Components/Search/IndexInput'
import { useEnableShortcutHandler } from '../Hooks/useChangeShortcutListener'
import { useFilterStore } from '../Hooks/useFilters'

import SplitView, { RenderSplitProps, SplitOptions, SplitType } from './SplitView'
import ViewSelector from './ViewSelector'

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
  onSearch: (searchTerm: string, idxKeys?: idxKey[]) => Promise<Item[]>

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

  /**
   * On search result update, the filterResults is called to get the filtered results
   * Maintain your external state for the filters
   * @param results Results to filter
   */
  filterResults?: (result: Item[]) => Item[]

  filterActions?: {
    filters: Filters
    resetCurrentFilters: () => void
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
  indexes,
  onSearch,
  onSelect,
  onDelete,
  onEscapeExit,
  getItemKey,
  filterResults,
  RenderItem,
  RenderPreview,
  RenderNotFound,
  RenderFilters,
  options = { view: ViewType.List },
  filterActions
}: SearchViewProps<Item>) => {
  const [searchState, setSS] = useState<SearchViewState<Item>>({
    selected: -1,
    searchTerm: '',
    result: []
  })

  const { resetCurrentFilters, filters, currentFilters, globalJoin } = useMemo(
    () =>
      filterActions ?? {
        filters: [],
        currentFilters: [],
        resetCurrentFilters: () => {
          /* do nothing */
        },
        globalJoin: 'all'
      },
    [filterActions]
  )

  // For filters
  const idxKeys = useFilterStore((store) => store.indexes) as idxKey[]
  const [view, setView] = useState<ViewType>(options?.view)
  const setIndexes = useFilterStore((store) => store.setIndexes)
  const setSelected = (selected: number) => setSS((s) => ({ ...s, selected }))
  const { enableShortcutHandler } = useEnableShortcutHandler()

  const setResult = (result: Item[], searchTerm: string) => {
    // mog('setresult', { result, searchTerm })
    setSS((s) => ({ ...s, result, searchTerm, selected: -1 }))
  }
  const onToggleIndexGroup = (indexGroup: string) => {
    const indexesOfGroup = indexes?.indexes[indexGroup]
    // mog('onToggleIndex', { indexesOfGroup, idxKeys })
    setIndexes(indexesOfGroup)
  }
  const clearSearch = () => {
    setSS((s) => ({ ...s, result: [], searchTerm: '', selected: -1 }))
    const defaultIndexes = indexes?.indexes[indexes?.default]
    setIndexes(defaultIndexes ?? [])
  }
  const { selected, searchTerm, result } = searchState

  const inpRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // mog('clearing search on ID change', { searchTerm, id })
    clearSearch()
  }, [id])

  const findCurrentIndex = () => {
    const indexGroup = Object.keys(indexes?.indexes ?? {})?.find(
      (indexGroup) => JSON.stringify(indexes?.indexes[indexGroup]) === JSON.stringify(idxKeys)
    )
    return indexGroup
  }

  const executeSearch = async (newSearchTerm: string) => {
    if (newSearchTerm === '') {
      // const res = onSearch(newSearchTerm)
      const curIndexGroup = findCurrentIndex()
      const initItems = Array.isArray(initialItems) ? initialItems : initialItems[curIndexGroup]
      console.log('INITAL', { initItems })
      const filtered = filterResults ? filterResults(initItems) : initItems
      // mog('ExecuteSearch - Initial', { newSearchTerm, currentFilters, filtered, initialItems, curIndexGroup })
      if (filtered?.length > 0 || currentFilters.length > 0) {
        setResult(filtered, newSearchTerm)
      }
    } else {
      const res = await onSearch(newSearchTerm, idxKeys)
      const filtered = filterResults ? filterResults(res) : res
      mog('ExecuteSearch - onNew', { newSearchTerm, currentFilters, filtered, res })
      setResult(filtered, newSearchTerm)
    }
  }

  const updateResults = useMemo(
    () => () => {
      // mog('SearchFiltersUpdate', { result, currentFilters })
      // const results = applyCurrentFilters(result)
      // mog('updating results', { result, currentFilters, initialItems })
      // setOnlyResult(results)
      executeSearch(searchTerm)
    },
    [currentFilters, globalJoin, result, initialItems, idxKeys]
  )

  useEffect(() => {
    updateResults()
  }, [currentFilters, idxKeys, globalJoin, initialItems])

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
            // else {
            //   if (currentFilters.length === 0) {
            //     onEscapeExit()
            //   }
            // }
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

  const splitOptions = options?.splitOptions ?? {
    type: selected > -1 ? SplitType.SIDE : SplitType.NONE,
    percent: 50
  }

  const ResultsView = (
    <Results key={`ResultForSearch_${id}`} view={view}>
      {/* {view === View.Card && RenderStartCard && <RenderStartCard />} */}
      {result?.map((c, i) => {
        // mog('item from result', { c, i })
        return (
          <RenderItem
            view={view}
            item={c}
            onMouseEnter={(e) => {
              e.preventDefault()
              if (selected !== i) setSelected(i)
            }}
            onClick={(e) => {
              onSelect(c, e)
            }}
            splitOptions={splitOptions}
            selected={i === selected}
            ref={i === selected ? selectedRef : null}
            id={`ResultForSearch_${getItemKey(c)}_${i}`}
            key={`ResultForSearch_${getItemKey(c)}_${i}`}
          />
        )
      })}
    </Results>
  )

  // mog('SearchContainer', { options, result, initialItems, id, selected, view })
  return (
    <SearchViewContainer key={id} id={id}>
      <SearchHeader>
        <InputWrapper>
          <Icon icon={searchLine} />
          <SearchInput
            autoFocus
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
          {indexes !== undefined && (
            <SearchIndexInput
              indexGroups={Object.keys(indexes.indexes)}
              onChange={(i) => {
                onToggleIndexGroup(i)
              }}
            />
          )}
        </InputWrapper>

        <ViewSelector
          currentView={view}
          availableViews={[ViewType.List, ViewType.Card]}
          onChangeView={(view) => {
            mog('onChangeView', { view })
            setView(view)
          }}
        />
      </SearchHeader>

      {RenderFilters && filters?.length > 0 ? <RenderFilters result={result} /> : null}

      <ResultsWrapper>
        {result?.length > 0 ? (
          view === ViewType.List && RenderPreview && options?.splitOptions?.type !== SplitType.NONE ? (
            <SplitView
              id={`SplitViewForSearch_${id}`}
              RenderSplitPreview={(props) => (
                <RenderPreview {...props} item={selected > -1 ? result?.[selected] : undefined} />
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
