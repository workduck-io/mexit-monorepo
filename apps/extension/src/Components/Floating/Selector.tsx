import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useRef,
  useState,
  useLayoutEffect
} from 'react'
import {
  useFloating,
  offset,
  flip,
  useListNavigation,
  useTypeahead,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  FloatingFocusManager,
  autoUpdate,
  size,
  FloatingOverlay,
  ContextData
} from '@floating-ui/react-dom-interactions'

interface SelectContextValue {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  activeIndex: number | null
  setActiveIndex: (index: number | null) => void
  listRef: React.MutableRefObject<Array<HTMLLIElement | null>>
  setOpen: (open: boolean) => void
  onChange: (value: string) => void
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => any
  dataRef: ContextData
}

const SelectContext = createContext({} as SelectContextValue)

export const Option: React.FC<{
  value: string
  index?: number
  children: React.ReactNode
}> = ({ children, index = 0, value }) => {
  const {
    selectedIndex,
    setSelectedIndex,
    listRef,
    setOpen,
    onChange,
    activeIndex,
    setActiveIndex,
    getItemProps,
    dataRef
  } = useContext(SelectContext)

  function handleSelect() {
    setSelectedIndex(index)
    onChange(value)
    setOpen(false)
    setActiveIndex(null)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSelect()
    }

    if (event.key === ' ') {
      event.preventDefault()
    }
  }

  function handleKeyUp(event: React.KeyboardEvent) {
    if (event.key === ' ' && !dataRef.current.typing) {
      handleSelect()
    }
  }

  return (
    <li
      className="Option"
      role="option"
      ref={(node) => (listRef.current[index] = node)}
      tabIndex={activeIndex === index ? 0 : 1}
      aria-selected={activeIndex === index}
      data-selected={selectedIndex === index}
      {...getItemProps({
        onClick: handleSelect,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp
      })}
    >
      {children}
      {selectedIndex === index &&
        {
          /* <CheckIcon /> */
        }}
    </li>
  )
}

export const OptionGroup: React.FC<{
  label: string
  children: React.ReactNode
}> = ({ children, label }) => {
  return (
    <li className="OptionGroup">
      <div className="OptionGroupLabel">{label}</div>
      <ul>{children}</ul>
    </li>
  )
}

export const Select: React.FC<{
  onChange: (value: string) => void
  render: (selectedIndex: number) => React.ReactNode
  value: string
  children: React.ReactNode
}> = ({
  children,
  value,
  render,
  onChange = (val) => {
    console.log('change', { val })
  }
}) => {
  const listItemsRef = useRef<Array<HTMLLIElement | null>>([])
  const listContentRef = useRef([
    'Select...',
    ...(Children.map(children, (child) =>
      Children.map(isValidElement(child) && child.props.children, (child) => child.props.value)
    ) ?? [])
  ])

  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(Math.max(0, listContentRef.current.indexOf(value)))
  const [pointer, setPointer] = useState(false)
  const open = true

  if (!open && pointer) {
    setPointer(false)
  }

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: () => true,
    whileElementsMounted: autoUpdate
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useClick(context),
    useRole(context, { role: 'listbox' }),
    useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex,
      selectedIndex,
      onNavigate: setActiveIndex
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      onMatch: open ? setActiveIndex : setSelectedIndex,
      activeIndex,
      selectedIndex
    })
  ])

  // Scroll the active or selected item into view when in `controlledScrolling`
  // mode (i.e. arrow key nav).
  useLayoutEffect(() => {
    if (open && activeIndex != null && !pointer) {
      requestAnimationFrame(() => {
        listItemsRef.current[activeIndex]?.scrollIntoView({
          block: 'nearest'
        })
      })
    }
  }, [open, activeIndex, pointer])

  let optionIndex = 0
  const options = [
    <ul key="default">
      <Option value="default">Select...</Option>
    </ul>,
    ...(Children.map(
      children,
      (child) =>
        isValidElement(child) && (
          <ul key={child.props.label} role="group" aria-labelledby={`floating-ui-select-${child.props.label}`}>
            <li
              role="presentation"
              id={`floating-ui-select-${child.props.label}`}
              className="SelectGroupLabel"
              aria-hidden="true"
            >
              {child.props.label}
            </li>
            {Children.map(child.props.children, (child) => cloneElement(child, { index: 1 + optionIndex++ }))}
          </ul>
        )
    ) ?? [])
  ]

  return (
    <SelectContext.Provider
      value={{
        selectedIndex,
        setSelectedIndex,
        activeIndex,
        setActiveIndex,
        listRef: listItemsRef,
        setOpen: () => true,
        onChange,
        getItemProps,
        dataRef: context.dataRef
      }}
    >
      <button
        {...getReferenceProps({
          ref: reference,
          className: 'SelectButton'
        })}
      >
        {render(selectedIndex - 1)}
        {/*<Arrow dir="down" />
         * TODO: Add arrow icon
         */}
      </button>
      <FloatingFocusManager context={context} initialFocus={selectedIndex}>
        <div
          {...getFloatingProps({
            ref: floating,
            className: 'Select',
            style: {
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              overflow: 'auto'
            },
            onPointerMove() {
              setPointer(true)
            },
            onKeyDown(event) {
              setPointer(false)
            }
          })}
        >
          {options}
        </div>
      </FloatingFocusManager>
    </SelectContext.Provider>
  )
}
