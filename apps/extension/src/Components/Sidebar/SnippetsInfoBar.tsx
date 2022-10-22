import React, { useRef, useState, useEffect } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { createPlateEditor, createPlateUI, serializeHtml } from '@udecode/plate'
import { debounce } from 'lodash'
import toast from 'react-hot-toast'

import { Infobox } from '@workduck-io/mex-components'

import {
  convertToCopySnippet,
  defaultCopyConverter,
  defaultCopyFilter,
  ELEMENT_TAG,
  mog,
  parseSnippet,
  Snippet
} from '@mexit/core'
import { SnippetCards, Input, SidebarListFilter, SidebarListFilterWrapper, SnippetSidebarHelp } from '@mexit/shared'

import { CopyTag } from '../../Editor/components/Tags/CopyTag'
import getPlugins from '../../Editor/plugins/index'
import useRaju from '../../Hooks/useRaju'
import { useSnippets } from '../../Hooks/useSnippets'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { copySnippetToClipboard, simulateOnChange, supportedDomains } from '../../Utils/pasteUtils'
import { getElementById } from '../../contentScript'
import SnippetCard from './SnippetCard'

export const SnippetsInfoBar = () => {
  const [search, setSearch] = useState('')
  const snippets = useSnippetStore((state) => state.snippets)
  const getSnippet = useSnippets().getSnippet
  const inputRef = useRef<HTMLInputElement>(null)
  const { dispatch } = useRaju()
  const [searchedSnippets, setSearchedSnippets] = useState<Snippet[]>(snippets)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const onInsertSnippet = async (snippetId: string) => {
    const snippet = getSnippet(snippetId)
    const originMatch = supportedDomains[window.location.origin]

    if (originMatch) {
      toast.loading('Click where you want to insert the snippet')

      window.addEventListener(
        'click',
        (event) => {
          const element = event.target
          const range = window.getSelection().getRangeAt(0)

          mog('check', { element, range })
          if (originMatch === 'html') {
            const filterdContent = convertToCopySnippet(snippet.content)
            const convertedContent = convertToCopySnippet(filterdContent, {
              filter: defaultCopyFilter,
              converter: defaultCopyConverter
            })

            const tempEditor = createPlateEditor({
              plugins: getPlugins(
                createPlateUI({
                  [ELEMENT_TAG]: CopyTag as any
                }),
                {
                  exclude: { dnd: true }
                }
              )
            })

            const html = serializeHtml(tempEditor, {
              nodes: convertedContent
            })

            const node = new DOMParser().parseFromString(html, 'text/html').body
            range.insertNode(node)
            range.collapse(false)

            // Combining the inserted text node into one
            document.activeElement.normalize()
            simulateOnChange()
          } else if (originMatch === 'plain') {
            range.insertNode(document.createTextNode(parseSnippet(snippet).text))
            range.collapse(false)

            // Combining the inserted text node into one
            document.activeElement.normalize()
            simulateOnChange()
          }

          toast.dismiss()
        },
        { once: true }
      )
    } else {
      await copySnippetToClipboard(snippet)
    }
  }

  const onSearch = async (newSearchTerm: string) => {
    const res = await dispatch('SEARCH', ['template', 'snippet'], newSearchTerm)

    if (newSearchTerm === '' && res.length === 0) {
      setSearchedSnippets(snippets)
    } else {
      const searched = res
        .map((r) => {
          const snippet = snippets.find((snippet) => snippet.id === r.id)

          return snippet
        })
        .filter((s) => s !== undefined) as Snippet[]

      setSearchedSnippets(searched)
    }
  }

  useEffect(() => {
    if (search && search !== '') {
      onSearch(search)
    }

    if (search === '') {
      setSearchedSnippets(snippets)
    }
  }, [search, snippets])

  return (
    <SnippetCards>
      <SidebarListFilterWrapper>
        <SidebarListFilter>
          <Icon icon={searchLine} />
          <Input
            autoFocus
            placeholder={'Search snippets'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
          />
        </SidebarListFilter>
        <Infobox
          text={SnippetSidebarHelp}
          // root={getElementById('ext-side-nav')}
        />
      </SidebarListFilterWrapper>
      {searchedSnippets?.map((snippet) => (
        <SnippetCard
          key={snippet?.id}
          keyStr={snippet?.id}
          snippet={snippet}
          onClick={() => onInsertSnippet(snippet.id)}
        />
      ))}
    </SnippetCards>
  )
}
