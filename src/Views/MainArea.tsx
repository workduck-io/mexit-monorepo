import React, { useEffect, useState } from 'react'
import { client } from '@workduck-io/dwindle'

import { useAuthStore, useAuthentication } from '../Hooks/useAuth'
import { apiURLs } from '../Utils/routes'
import { activityNode as InitActivities } from '../Utils/activity'
import { parseNode } from '../Utils/flexsearch'
import useSearchStore from '../Hooks/useSearchStore'
import { Node, FlexSearchResult } from '../Types/Data'

export const Logout = () => {
  const { logout } = useAuthentication()

  const onLogout = () => {
    logout()
  }

  return (
    <>
      <button onClick={onLogout}>Logout</button>
    </>
  )
}

export const UserActivities = () => {
  const [activities, setActivities] = useState<Node>(InitActivities)
  const [blockCount, setBlockCount] = useState<number>(InitActivities.content.length)
  const userDetails = useAuthStore((store) => store.userDetails)
  const url = apiURLs.fetchActivities(userDetails.userId)
  const initializeSearchIndex = useSearchStore((store) => store.initializeSearchIndex)
  const searchIndex = useSearchStore((store) => store.searchIndex)
  const [results, setResults] = useState<FlexSearchResult[]>([])

  useEffect(() => {
    const initList = parseNode(activities)
    console.log('Initlist: ', JSON.stringify(initList))
    const index = initializeSearchIndex(initList)

    const results = searchIndex('block')
    console.log('Results: ', JSON.stringify(results))
    setResults(results)
  }, [activities])

  // useEffect(() => {
  //   async function fetchActivities() {
  //     await client
  //       .get(url)
  //       .then((response: any) => {
  //         // setActivities(response.data.message)
  //       })
  //       .catch((err) => {
  //         console.error('Err: ', err)
  //       })
  //   }
  //   fetchActivities()
  // }, [])
  return (
    <>
      <h1>Quick Captures</h1>
      {blockCount !== -1 && <h3>Number of Captures: {blockCount}</h3>}
      <p key={activities.id}>{JSON.stringify(activities)}</p>

      <h1>Search Results for Block</h1>
      {JSON.stringify(results)}
    </>
  )
}

function MainArea() {
  const userDetails = useAuthStore((store) => store.userDetails)
  return (
    <>
      <h1>Hello, World! Does this update?</h1>
      <p>{JSON.stringify(userDetails)}</p>

      <UserActivities />
      <Logout />
    </>
  )
}

export default MainArea
