import { IS_DEV } from './routes'

type MogOptions = {
  pretty: boolean
  collapsed: boolean
}

export const mog = (
  title: string,
  propertiesToLog: Record<string, any>,
  options: Partial<MogOptions> = { pretty: false, collapsed: false }
) => {
  if (IS_DEV) {
    options.collapsed ? console.groupCollapsed(title) : console.group(title)
    Object.entries(propertiesToLog).forEach(([key, value]) => {
      console.info(`${key}: `, options?.pretty ? JSON.stringify(value, null, 2) : value)
    })
    console.groupEnd()
  }
}
