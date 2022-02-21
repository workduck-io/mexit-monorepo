import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ConverterForm {
  from: string
  to: string
  amount?: number
}

const CurrencyConverter = () => {
  const [convertedVal, setConvertedVal] = useState<number>()
  const [outCurrency, setOutCurrency] = useState<string>()

  const { handleSubmit, register } = useForm<ConverterForm>({
    defaultValues: {
      from: 'USD',
      to: 'INR',
      amount: 1.0
    }
  })

  const submitHandler = (data: ConverterForm) => {
    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'GET_CURRENCY_CONVERSION',
        data: {
          params: data
        }
      },
      (response) => {
        const { message, error } = response
        if (!error) {
          setConvertedVal(message)
          setOutCurrency(data.to)
        }
      }
    )
  }

  return (
    <>
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
    </>
  )
}

export default CurrencyConverter
