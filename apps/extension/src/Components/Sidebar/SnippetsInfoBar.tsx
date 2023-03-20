import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import searchLine from '@iconify/icons-ri/search-line'
import { createPlateEditor, createPlateUI, serializeHtml } from '@udecode/plate'
import { debounce } from 'lodash'
import { useTheme } from 'styled-components'

import {
  convertToCopySnippet,
  defaultCopyConverter,
  defaultCopyFilter,
  DefaultMIcons,
  ELEMENT_TAG,
  parseSnippet,
  Snippet
} from '@mexit/core'
import {
  CenteredColumn,
  getMIcon,
  Input,
  List,
  MexIcon,
  SidebarListFilter,
  SnippetCards,
  useQuery
} from '@mexit/shared'

import { CopyTag } from '../../Editor/components/Tags/CopyTag'
import { generateEditorPluginsWithComponents } from '../../Editor/plugins/index'
import { useSnippets } from '../../Hooks/useSnippets'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { wSearchIndexWithRanking } from '../../Sync/invokeOnWorker'
import { copySnippetToClipboard, simulateOnChange, supportedDomains } from '../../Utils/pasteUtils'

import SidebarSection from './SidebarSection'
import SnippetCard from './SnippetCard'

export const SnippetsInfoBar = () => {
  const [search, setSearch] = useState('')
  const snippets = useSnippetStore((state) => Object.values(state.snippets ?? {}))
  const getSnippet = useSnippets().getSnippet
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchedSnippets, setSearchedSnippets] = useState<Snippet[]>(snippets)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const { generateSearchQuery } = useQuery()

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

          if (originMatch === 'html') {
            const filterdContent = convertToCopySnippet(snippet.content)
            const convertedContent = convertToCopySnippet(filterdContent, {
              filter: defaultCopyFilter,
              converter: defaultCopyConverter
            })

            const tempEditor = createPlateEditor({
              plugins: generateEditorPluginsWithComponents(
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
    const query = generateSearchQuery(newSearchTerm)
    const res = await wSearchIndexWithRanking(['template', 'snippet'], query)

    if (newSearchTerm === '' && res.length === 0) {
      setSearchedSnippets(snippets)
    } else {
      const searched = res
        .map((r) => {
          const snippet = snippets.find((snippet) => snippet.id === r.parent)

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

  const theme = useTheme()

  return (
    <SnippetCards>
      <SidebarSection label="Search Snippets" icon={getMIcon('ICON', 'ri:link-m')}>
        <SidebarListFilter noMargin>
          <MexIcon height={20} width={20} icon={searchLine} margin="0.6rem 0" />
          <Input
            autoFocus
            fontSize="1rem"
            placeholder={'Type to search...'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
          />
        </SidebarListFilter>
      </SidebarSection>
      {!searchedSnippets?.length ? (
        <CenteredColumn>
          <MexIcon
            color={theme.tokens.colors.primary.default}
            $noHover
            width="32"
            height="32"
            icon="gg:file-document"
          />
          <p>{!search ? 'All your Snippets will shown here!' : 'No Results Found!'}</p>
        </CenteredColumn>
      ) : (
        <SidebarSection label="Popular" icon={DefaultMIcons.SNIPPET}>
          <List $noMargin scrollable>
            {searchedSnippets?.map((snippet) => (
              <SnippetCard
                key={snippet?.id}
                keyStr={snippet?.id}
                snippet={snippet}
                onClick={(event) => {
                  event.stopPropagation()
                  onInsertSnippet(snippet.id)
                }}
              />
            ))}
          </List>
        </SidebarSection>
      )}
    </SnippetCards>
  )
}
