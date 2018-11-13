import axios from 'axios'
import store from '../store'
import { createUserSignInData } from '../store/actions/user'
import { setUserNotebooks } from '../store/actions/notebooks'
import { setUserNotepages } from '../store/actions/notepages'

/**
 * Authenticates user's credentials and will either login or register the user.
 *
 * @param {Object} credentials - includes { username, password }
 * @param {String} submissionType - either login or register
 */
export async function authenticateUser(credentials, submissionType) {
  const endpoint = `/${submissionType}`

  try {
    const authenticated = await axios.post(endpoint, credentials)
    if (authenticated) {
      const userData = await getUserData(credentials.username)
      return userData
    }
  } catch (error) {
    throw Error(error.response.data.error)
  }
}

export async function getUserData (username) {
  const endpoint2 = `/${username}/workspace`

  try {
    const userData = await axios.get(endpoint2)
    setUserData(userData.data)
    return userData.data
  } catch (error) {
    throw Error(error.response.data.error || null)
  }
}

function setUserData (userData) {
  const { notebooks, notepages, username } = userData
  if (notebooks.length) {
    console.log('here')
    store.dispatch(setUserNotebooks(notebooks))
  }

  if (notepages.length) {
    console.log('here')
    store.dispatch(setUserNotepages(notepages))
  }

  store.dispatch(createUserSignInData(username))
}