import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { focusEditor, getPlateEditorRef } from '@udecode/plate'

import { IconButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { API, useComboboxStore, usePromptStore } from '@mexit/core'
import { ComboSeperator, Data } from '@mexit/shared'

import usePrompts from '../../../../../Hooks/usePrompts'
import { getNextWrappingIndex } from '../../../../Utils/getNextWrappingIndex'

import Prompt from './Prompt'
import PromptResult from './PromptResult'
import { PromptMetadata } from './styled'

const PromptMeta = ({ promptId, size, onNext, onPrevious }) => {
  const resultIndex = usePromptStore((s) => s.resultIndexes[promptId])

  const showLeftIcon = resultIndex >= 0
  const showRightIcon = resultIndex < size - 1

  const onNextClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onNext()
  }

  const onPreviousClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onPrevious()
  }

  return (
    <PromptMetadata>
      <Data>
        {showLeftIcon && (
          <IconButton onClick={onPreviousClick} title="Previous" shortcut="Shift+Tab" icon="uil:arrow-left" size={16} />
        )}
      </Data>
      <Data>
        {showRightIcon && (
          <IconButton onClick={onNextClick} title="Next" shortcut="Tab" icon="uil:arrow-right" size={16} />
        )}
      </Data>
    </PromptMetadata>
  )
}

type PromptPreviewProps = {
  promptId: string
}

const PromptPreview: React.FC<PromptPreviewProps> = ({ promptId }) => {
  const { allPrompts } = usePrompts()

  const resultIndex = usePromptStore((s) => s.resultIndexes[promptId])
  const results = usePromptStore((s) => s.results[promptId])
  const setPromptIndex = usePromptStore((s) => s.setResultIndex)

  const prompt = allPrompts.find((prompt) => prompt.entityId === promptId)

  const setNextSpaceIndex = (reverse = false) => {
    const at = usePromptStore.getState().resultIndexes[promptId]
    const results = usePromptStore.getState().results[promptId]

    if (results) {
      const nextIndex = getNextWrappingIndex(reverse ? -1 : 1, at, results.length, () => undefined, false)

      setPromptIndex(promptId, reverse && at === 0 ? -1 : nextIndex)

      try {
        focusEditor(getPlateEditorRef())
      } catch (err) {
        console.log('Unable to focus editor')
      }
    }
  }

  useEffect(() => {
    const unsubscribePagination = tinykeys(
      window,
      {
        Tab: (event) => {
          event.preventDefault()
          event.stopPropagation()

          setNextSpaceIndex()
        },
        'Shift+Tab': (event) => {
          event.preventDefault()
          event.stopPropagation()

          setNextSpaceIndex(true)
        }
      },
      { allowRepeat: true }
    )

    const unsubscribe = tinykeys(window, {
      'Alt+Enter': (event) => {
        event.preventDefault()
        event.stopPropagation()

        const isLoading = useComboboxStore.getState().itemLoading?.item === promptId

        if (!isLoading) {
          useComboboxStore.getState().setItemLoading({ item: promptId, message: 'Generating...' })

          //TODO: This is where the streaming lambda has to be used
          API.prompt
            .generateResult({ promptId })
            .then((res) => {
              if (res) {
                const result = [res.content]
                usePromptStore.getState().addPromptResult(promptId, result)
                useComboboxStore.getState().setItemLoading()
              }
            })
            .catch((err) => {
              console.error('Unable to generate result', { err })
              useComboboxStore.getState().setItemLoading()
              toast('Unable to generate result')
            })
        }
      }
    })

    return () => {
      unsubscribe()
      unsubscribePagination()
    }
  }, [promptId])

  const showResult = results?.[resultIndex] && resultIndex !== -1

  return (
    <ComboSeperator fixedWidth>
      <section>{!showResult ? <Prompt prompt={prompt} /> : <PromptResult promptId={promptId} />}</section>

      {results && (
        <PromptMeta
          promptId={promptId}
          onPrevious={() => setNextSpaceIndex(true)}
          onNext={() => setNextSpaceIndex()}
          size={results.length}
        />
      )}
    </ComboSeperator>
  )
}

export default PromptPreview
