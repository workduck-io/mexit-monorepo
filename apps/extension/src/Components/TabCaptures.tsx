import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { toast } from 'react-hot-toast'

import { Tab, TabGroup } from '../Types/Tabs'
import { useTabCaptureStore } from '../Hooks/useTabCaptures'

interface TabCaptureFormDetails {
  name: string
}

const CreateTabCapture = () => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [checked, setChecked] = useState<boolean[]>([])

  const { handleSubmit, register } = useForm<TabCaptureFormDetails>()

  const addCapture = useTabCaptureStore((store) => store.addTabCapture)

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'GET_CURRENT_WINDOW_TABS'
      },
      (response) => {
        setTabs(response.message)
        setChecked(new Array<boolean>(response.message.length).fill(true))
      }
    )
  }, [])

  const handleOnChange = (position) => {
    const updatedCheckedState = checked.map((item, index) => (index === position ? !item : item))
    setChecked(updatedCheckedState)
  }

  const onSubmit = (data: TabCaptureFormDetails) => {
    const selectedTabs = tabs.filter((tab, index) => {
      if (checked[index]) return tab
    })

    const tabGroup: TabGroup = {
      id: `TAB_GROUP_${nanoid()}`,
      name: data.name,
      tabs: selectedTabs,
      windowId: selectedTabs[0].windowId ? selectedTabs[0].windowId : -1
    }

    const { message, error } = addCapture(tabGroup)
    if (error) {
      toast.error(error)
    } else {
      toast.success('Tab Group Created Successfully!', { duration: 2000 })
      setTimeout(() => {
        // closeSputlit()
      }, 2000)
    }
  }

  return (
    <>
      <h2>Select the tabs you wish to save</h2>

      {tabs.length !== 0 && (
        <ul>
          {tabs.map((tab, index) => {
            return (
              <li key={index}>
                <input
                  type="checkbox"
                  id={`custom-checkbox-${index}`}
                  name={tab.title}
                  checked={checked[index]}
                  onChange={() => handleOnChange(index)}
                />
                <label htmlFor={`custom-checkbox-${index}`}>{tab.title}</label>
              </li>
            )
          })}
        </ul>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Name this group of tabs" {...register('name')} />
        <input type="submit" />
      </form>
    </>
  )
}

const ShowTabCaptures = () => {
  const capturedGroups = useTabCaptureStore((store) => store.TabCaptures)

  const handleTabGroupSubmit = (e: any) => {
    e.preventDefault()

    const idx = e.currentTarget.value
    const capture = capturedGroups[idx]

    const URLs = capture.tabs.map((tab) => tab.url)

    chrome.runtime.sendMessage(
      {
        type: 'ASYNC_ACTION_HANDLER',
        subType: 'OPEN_WINDOW_WITH_TABS',
        data: {
          urls: URLs
        }
      },
      (response) => {
        const { message, error } = response
        if (error) toast.error('Some error occured. Please Try Again')
      }
    )
  }

  return (
    <>
      <h1>Captured Tab Groups</h1>
      <ul>
        {capturedGroups.map((capture, index) => {
          return (
            <li key={index}>
              <h3>Name: {capture.name}</h3>
              <button key={index} value={index} onClick={handleTabGroupSubmit}>
                Open
              </button>
              <ul>
                {capture.tabs.map((tab, tabIndex) => {
                  return (
                    <li key={tabIndex}>
                      <div>
                        {tab.title} | {tab.url}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export { CreateTabCapture, ShowTabCaptures }
