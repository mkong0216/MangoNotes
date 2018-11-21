import axios from 'axios'
import store from '../store'
import { setUserNotebooks, updateUserNotebooks } from '../store/actions/notebooks'
import { setUserNotepages, updateUserNotepages } from '../store/actions/notepages'

/**
 * Authenticating user's login or register attempt
 * 
 * @param {Object} credentials - in shape of { username, password }
 * @param {String} submissionType - either 'login' or 'register'
 * 
 * @returns {Object} - returns either an object in shape of { username, userId }, or an error message
 */
export async function authenticateUser (credentials, submissionType) {
  const endpoint = `/${submissionType}`

  try {
    const signedIn = await axios.post(endpoint, credentials)
    await retrieveUsersWork(signedIn.data.userId)

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
 * @returns {Array} - [parent notebooks, free notepages]
 */
export async function retrieveUsersWork (userId) {
  const endpoint = `/workspace/${userId}`

  try {
    const results = await axios.get(endpoint)

    if (results.data.notebooks.length) {
      const notebooks = results.data.notebooks.map((notebook) => {
        return {
          notebookId: notebook.id,
          title: notebook.title,
          updatedAt: notebook.updatedAt
        }
      })

      store.dispatch(setUserNotebooks(notebooks))
    }

    if (results.data.notepages.length) {
      const notepages = results.data.notepages.map((notepage) => {
        return {
          notepageId: notepage.id,
          title: notepage.title,
          updatedAt: notepage.updatedAt
        }
      })

      store.dispatch(setUserNotepages(notepages))
    }

    return results.data
  } catch (error) {
    console.log(error)
  }
}

/**
 * Updates user's parent notebooks or free notepages
 *
 * @param {String} userId
 * @param {Object} details - in shape of { title, id, creator, parentNotebook, type }
 *
 * @returns {Object}
 */
export async function updateUsersWork (userId, details) {
  const endpoint = `/workspace/add-${details.type}/${userId}`

  try {
    const response = await axios.put(endpoint, details)

    if (details.type === 'notepage') {
      store.dispatch(updateUserNotepages(response.data))
    } else if (details.type === 'notebook') {
      store.dispatch(updateUserNotebooks(response.data))
    }

    return response.data
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

