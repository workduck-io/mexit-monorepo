import React from 'react'

import { SubmitHandler, useForm } from 'react-hook-form'

import { ELEMENT_H2, ELEMENT_PARAGRAPH, mog } from '@mexit/core'

import { FormBuilder } from '../../Types/Form'

interface FormProps {
  config: FormBuilder
}
const Form: React.FC<FormProps> = ({ config }) => {
  const { register, handleSubmit } = useForm()
  const onSubmit: SubmitHandler<any> = (data) => {
    mog('OnSubmitMagicalForm', { data })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      (
      {config.map((item) => {
        let InputElement: JSX.Element
        //TODO: Add other element types and better default
        switch (item.properties.type) {
          case ELEMENT_PARAGRAPH:
          case ELEMENT_H2:
            InputElement = <input type="text" {...register(item.label, item.properties)} />
            break
          default:
            InputElement = <input type="text" {...register(item.label, item.properties)} />
        }
        return (
          <>
            <label>{item.label}</label>
            {InputElement}
          </>
        )
      })}
      )
    </form>
  )
}

export default Form
