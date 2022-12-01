import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTransition } from 'react-spring'

import { fuzzySearch } from '@mexit/core'
import { HoverSubtleGlow , Input, Result, ResultHeader, Results, ResultTitle, SearchPreviewWrapper, View } from '@mexit/shared'

import NamespaceTag from '../Components/NamespaceTag'
import { defaultContent } from '../Data/baseData'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useLinks } from '../Hooks/useLinks'
import useLoad from '../Hooks/useLoad'
import { useNamespaces } from '../Hooks/useNamespaces'
import { NavigationType,ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useTags } from '../Hooks/useTags'
import { useContentStore } from '../Stores/useContentStore'
import { debounce } from 'lodash'
import styled, { css } from 'styled-components'

const TagsWrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};

  ${Input} {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }
`

const TagsSidebar = styled.div`
  flex-grow: 0;
  min-width: 200px;
  max-width: 300px;
  margin-right: ${({ theme }) => theme.spacing.large};
`

const TagMain = styled.div`
  flex: 4;
`

export const BaseLink = styled.div`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-bottom: ${({ theme }) => theme.spacing.small};

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0px 2px 6px ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
  ${HoverSubtleGlow}
`

const TagLink = styled(BaseLink)<{ active?: boolean; selected?: boolean }>`
  color: ${({ theme }) => theme.colors.text.fade};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  ${({ theme, active }) =>
    active &&
    css`
      background-color: ${theme.colors.gray[8]};
      color: ${theme.colors.primary};
    `}
  ${({ theme, selected }) =>
    selected &&
    css`
      background-color: ${theme.colors.gray[8]};
      box-shadow: 0 0 0px 1px ${({ theme }) => theme.colors.primary};
      color: ${theme.colors.primary};
    `}
`

const Tag = () => {
  const contents = useContentStore((store) => store.contents)
  const { tag } = useParams<{ tag: string }>()
  // const tagsCache = useDataStore((store) => store.tagsCache)
  const { getNodesAndCleanCacheForTag } = useTags()
  const { getILinkFromNodeid } = useLinks()
  const { getNamespace } = useNamespaces()
  const { nodes, cleanCache } = getNodesAndCleanCacheForTag(tag)
  const { goTo } = useRouting()
  const { loadNode } = useLoad()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)
  const [tags, setTags] = useState(Object.keys(cleanCache))

  const transition = useTransition(nodes, {
    // sort: (a, b) => (a.score > b.score ? -1 : 0),
    keys: (item) => `${tag}_${item}`,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    trail: 50,
    duration: 200,
    config: {
      mass: 1,
      tension: 200,
      friction: 16
    }
  })

  const navigateToTag = (tag: string) => {
    setSelected(-1)
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const incSelected = () => setSelected((s: number) => (s > -1 ? s - 1 : tags.length - 1))
  const decSelected = () => setSelected((s: number) => (s < tags.length - 1 ? s + 1 : -1))

  const onKeyDownSearch: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === 'Tab') {
      e.preventDefault()
      // Blur the input if necessary (not needed currently)
      // if (inputRef.current) inputRef.current.blur()
      if (e.shiftKey) {
        incSelected()
      } else {
        decSelected()
      }
    }

    if (e.code === 'ArrowUp') {
      incSelected()
    }
    if (e.code === 'ArrowDown') {
      decSelected()
    }
    if (e.code === 'Escape') {
      setSelected(-1)
    }
    if (e.code === 'Enter') {
      // Only when the selected index is -1
      if (selected > -1 && selected < tags.length) {
        navigateToTag(tags[selected])
      }
    }
  }

  useEffect(() => {
    if (search && search !== '') {
      const filtered = fuzzySearch(Object.keys(cleanCache), search)
      setTags(filtered)
    }
    if (search === '') {
      setTags(Object.keys(cleanCache))
    }
  }, [search])

  return (
    <TagsWrapper>
      <TagsSidebar>
        <h1>Tags</h1>

        <Input
          placeholder="Filter tags"
          onChange={debounce((e) => onSearchChange(e), 250)}
          onKeyUp={debounce(onKeyDownSearch, 250)}
        />

        {tags.map((k, i) => {
          return (
            <TagLink
              active={k === tag}
              selected={selected === i}
              key={`tags_sidebar_${tag}_${k}`}
              onClick={(e) => {
                e.preventDefault()
                navigateToTag(k)
              }}
            >
              #{k}
            </TagLink>
          )
        })}
      </TagsSidebar>
      <TagMain>
        <h1>#{tag}</h1>
        <p>Notes with tag</p>
        <Results view={View.Card}>
          {transition((styles, nodeid, _t, _i) => {
            const con = contents[nodeid]
            const node = getILinkFromNodeid(nodeid, true)
            const content = con ? con.content : defaultContent.content
            const namespace = getNamespace(node?.namespace)

            return (
              <Result
                // eslint-disable-next-line
                // @ts-ignore
                onClick={() => {
                  loadNode(nodeid)
                  goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
                }}
                style={styles}
                view={View.Card}
                key={`tag_res_prev_${tag}_${nodeid}${_i}`}
              >
                <ResultHeader>
                  <ResultTitle>{node?.path}</ResultTitle>
                  <NamespaceTag namespace={namespace} />
                </ResultHeader>
                <SearchPreviewWrapper>
                  <EditorPreviewRenderer content={content} editorId={`editor_${tag}_preview_${nodeid}`} />
                </SearchPreviewWrapper>
              </Result>
            )
          })}
        </Results>
      </TagMain>
    </TagsWrapper>
  )
}

export default Tag
