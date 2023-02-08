import { IS_DEV } from './config'

type MogOptions = {
  pretty: boolean
  collapsed: boolean
}

export const mog = (
  title: string,
  propertiesToLog?: Record<string, any>,
  options: Partial<MogOptions> = { pretty: false, collapsed: false }
) => {
  // eslint-disable-next-line
  if (IS_DEV) {
    options.collapsed ? console.groupCollapsed(title) : console.group(title)
    if (propertiesToLog)
      Object.entries(propertiesToLog).forEach(([key, value]) => {
        console.info(`${key}: `, options?.pretty ? JSON.stringify(value, null, 2) : value)
      })
    console.groupEnd()
  }
}
