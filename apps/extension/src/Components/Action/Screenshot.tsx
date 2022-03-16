import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../../Hooks/useAuth'

import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'

const Screenshot = () => {
  const { setVisualState, setSelection } = useSputlitContext()
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)

  useEffect(() => {
    setVisualState(VisualState.hidden)
    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'CAPTURE_VISIBLE_TAB',
        data: {
          workspaceId: workspaceDetails.id
        }
      },
      (response) => {
        const { message, error } = response
        if (error) toast.error('Could not capture screenshot')
        else {
          console.log('Message: ', message)
          setVisualState(VisualState.showing)
          setSelection({
            editContent: [
              {
                children: [
                  {
                    text: message
                  }
                ],
                type: 'a',
                url: message
              },
              {
                text: '\n'
              },
              {
                text: '['
              },
              {
                type: 'a',
                url: message,
                children: [
                  {
                    text: 'Ref'
                  }
                ]
              },
              {
                text: ' ]'
              }
            ]
          })
        }
      }
    )
  }, [])
  return null
}

export default Screenshot
