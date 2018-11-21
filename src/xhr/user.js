import axios from 'axios'
import store from '../store'
import { setUserNotebooks } from '../store/actions/notebooks'
import { setUserNotepages } from '../store/actions/notepages'

/**
 * Authenticating user's login or register attempt
 * 
 * @param {Object} credentials - in shape of { username, password }
 * @param {String} submissionType - either 'login' or 'register'
 * 
 * Returns either an object in shape of { username, userId }, or an error message
 */
export async function authenticateUser (credentials, submissionType) {
  const endpoint = `/${submissionType}`

  try {
    const signedIn = await axios.post(endpoint, credentials)
    retrieveUsersWork(signedIn.data.userId)

    window.sessionStorage.userId = JSON.stringify(signedIn.data)
    return signedIn.data
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

/**
 * Get all parent notebooks and/or free notepages from user
 * Parent notebook - notebook that is not within another notebook
 * Free notepage - notepage that is not within a notebook
 * 
 * @param {String} userId 
 * 
 * Returns Object of parent notebooks and free notepages
 */
export async function retrieveUsersWork (userId) {
  const endpoint = `/workspace/${userId}`

  try {
    const results = await axios.get(endpoint)

    if (results.data.notebooks.length) {
      console.log(results.data.notebooks)
      store.dispatch(setUserNotebooks(results.notebooks))
    }

    if (results.data.notepages.length) {
      store.dispatch(setUserNotepages(results.notepages))
    }

    return results
  } catch (error) {
    console.log(error)
  }
}

/**
 * Updates user's parent notebooks or free notepages
 *
 * @param {String} userId
 * @param {Object} details - in shape of { title, id, creator }
 * @param {String} type - either notebook or notepage
 */
export async function updateUsersWork (userId, details, type) {
  const endpoint = `/workspace/add-${type}/${userId}`

  try {
    const response = await axios.put(endpoint, details)
    return response.data
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

