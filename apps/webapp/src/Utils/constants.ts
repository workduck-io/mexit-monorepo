/* eslint-disable no-useless-escape */

export const EMAIL_REG =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/

export const MultiEmailValidate = (emailsRaw: string): boolean => {
  const isValid = getWrongEmails(emailsRaw).length === 0
  return isValid
}

export const getWrongEmails = (emailsRaw: string): string[] => {
  const emails = emailsRaw.split(',').map((email) => email.trim())
  const wrongEmails = emails.filter((email: string): boolean => {
    const cond = email.match(EMAIL_REG).length > 0
    return !cond
  })

  return wrongEmails
}
