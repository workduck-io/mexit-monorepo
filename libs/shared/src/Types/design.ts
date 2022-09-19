import { IconifyIcon } from '@iconify/react'

/**
 * A single entity,
 * meant for rendering
 */
export interface DesignItem {
  id: string
  label: string
  icon?: string | IconifyIcon
}
