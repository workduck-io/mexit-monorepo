import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { resize } from '../../Utils/helper'

interface ConverterForm {
  from: string
  to: string
  amount?: number
}

export const CurrencyConverter = () => {
  const [convertedVal, setConvertedVal] = useState<number>()
  const [outCurrency, setOutCurrency] = useState<string>()
  const elementRef = useRef(null)

  const { handleSubmit, register } = useForm<ConverterForm>({
    defaultValues: {
      from: 'USD',
      to: 'INR',
      amount: 1.0
    }
  })

  const submitHandler = (data: ConverterForm) => {
    const url = new URL('https://api.frankfurter.app/latest')
    url.search = new URLSearchParams(data as any).toString()

    return fetch(url.toString())
      .then((resp) => resp.json())
      .then((val) => {
        const conv = val.rates[data.to]
        return { message: conv, error: null }
      })
      .catch((error) => {
        return { message: null, error: error }
      })
  }

  useEffect(() => {
    if (elementRef !== null) {
      resize(elementRef)
    }
  }, [elementRef])

  return (
    <div ref={elementRef}>
      <h1>Convert Between Currencies</h1>

      <form onSubmit={handleSubmit(submitHandler)}>
        <input type="text" placeholder="From Currency Code" {...register('from')} />
        <input type="text" placeholder="To Currency Code" {...register('to')} />
        <input type="text" placeholder="Amount" {...register('amount')} defaultValue="1.0" />
        <input type="submit" value="Convert" />
      </form>

      {convertedVal && (
        <h4>
          Result: {convertedVal} {outCurrency}
        </h4>
      )}

      <h3>
        Credits:
        <a href="https://www.frankfurter.app" rel="noopener noreferrer" target="_blank">
          Frankfurter App
        </a>
      </h3>
    </div>
  )
}
