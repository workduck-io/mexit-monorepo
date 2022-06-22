/* eslint-disable no-useless-escape */

export const EMAIL_REG =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-“!@#%&\/,><\’:;|_~`])\S{8,99}$/

/*
 * The following regex is used to validate the format of the alias
 *
 * Rules: AlphaNumeric, no spaces, - and _ as spearator,
 * separator cannot be in the beginning or end of the alias
 *
 * See: https://stackoverflow.com/a/1223146/
 */
export const ALIAS_REG = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/

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

export const getEmailStart = (email: string) => email?.substring(0, email?.indexOf('@')) ?? 'null'
