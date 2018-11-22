import axios from 'axios'
import store from '../store'
import { setUserNotebooks, updateUserNotebook, addUserNotebook } from '../store/actions/notebooks'
import { setUserNotepages, updateUserNotepage, addUserNotepage } from '../store/actions/notepages'

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
 * @param {Number} index - index of changed notebook or notepage
 *
 * @returns {Object}
 */
export async function updateUsersWork (userId, details, index) {
  const endpoint = `/workspace/add-${details.type}/${userId}`
  // createNew tells server to either create a new NoteDetail or find existing one
  details.createNew = (index !== 0 && !index)
  console.log(details)

  try {
    const response = await axios.put(endpoint, details)

    if (details.type === 'notepage') {
      if (index) {
        store.dispatch(addUserNotepage(response.data, index))
      } else {
        store.dispatch(updateUserNotepage(response.data))
      }
    } else if (details.type === 'notebook') {
      if (index) {
        store.dispatch(addUserNotebook(response.data, index))
      } else {
        store.dispatch(updateUserNotebook(response.data))
      }
    }

    return response.data
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

