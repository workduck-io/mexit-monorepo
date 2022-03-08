import React from 'react'
import ReactDOM from 'react-dom'
import toast from 'react-hot-toast'

export function wrapErr<T>(f: (result: T) => void) {
  return (err: any, result: T) => {
    if (err) {
      console.error({ error: JSON.stringify(err) })
      return
    } else f(result)
  }
}

export async function copyToClipboard(text: any) {
  await navigator.clipboard
    .writeText(String(text))
    .then(() => {
      toast.success('Copied to Clipboard!')
    })
    .catch((err) => {
      toast.error('An error occurred. Please try again later')
    })
}
