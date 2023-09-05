import { useEffect, useState } from 'react'

import { SmartCaptureAction } from '@mexit/core'
import { DefaultMIcons } from '@mexit/shared'

import { useActionExecutor } from '../../Hooks/useActionExecutor'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import SidebarSection from '../Sidebar/SidebarSection'

import { SmartCapture } from './SmartCapture'

/**
 *
 * @returns A section that allows the user to add a contact to a smart capture list
 *
 */
const ContactSmartCaptureSection = () => {
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const triggerCapture = useSputlitStore((store) => store.captureProfile)

  const { execute } = useActionExecutor()

  useEffect(() => {
    // * Extracts the contact data from the current page

    try {
      const data = execute(SmartCaptureAction)
      if (data) setShow(true)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(true)
      setShow(false)
    }
  }, [triggerCapture])

  if (isLoading || !show) return <></>

  return (
    <SidebarSection scrollable label="Smart Capture" icon={DefaultMIcons.AI}>
      <SmartCapture />
    </SidebarSection>
  )
}

export default ContactSmartCaptureSection
