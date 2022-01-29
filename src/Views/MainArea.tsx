import React, { useEffect, useState } from 'react'
import { client } from '@workduck-io/dwindle'

import { useAuthStore, useAuthentication } from '../Hooks/useAuth'
import { apiURLs } from '../Utils/routes'
import { activities as InitActivities } from '../Utils/activity'

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
  const [activities, setActivities] = useState<any>(InitActivities)
  const [blockCount, setBlockCount] = useState<number>(InitActivities.blocks.length)
  const userDetails = useAuthStore((store) => store.userDetails)
  const url = apiURLs.fetchActivities(userDetails.userId)

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
      {activities.blocks.map((item, id) => (
        <p key={id}>Item is: {JSON.stringify(item)}</p>
      ))}
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
