import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import langList from '../../Utils/langList'

interface TranslateForm {
  q?: string
  from: string
  to: string
}

const LibreTranslate = () => {
  const [translatedText, setTranslatedText] = useState<string>()

  const { handleSubmit, register } = useForm<TranslateForm>({
    defaultValues: {
      from: 'en',
      to: 'fr'
    }
  })

  const onFormSubmit = (data: TranslateForm) => {
    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'GET_LIBRE_TRANSLATE',
        data: {
          body: data
        }
      },
      (response) => {
        const { message, error } = response
        if (!error) setTranslatedText(message)
      }
    )
  }

  return (
    <>
      <h1>Translate Between Languages</h1>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <input type="text" placeholder="Text to Translate" {...register('q')} />
        <input type="text" placeholder="From Language Code" {...register('from')} />
        <input type="text" placeholder="To Language Code" {...register('to')} />

        <input type="submit" />
      </form>
      {translatedText && (
        <>
          <h3>Your Translated Text: </h3>
          <textarea value={translatedText} />
        </>
      )}

      <h4>
        Powered By <a href="https://libretranslate.com/">Libre Translate</a>
      </h4>
    </>
  )
}

export default LibreTranslate
