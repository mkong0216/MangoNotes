import axios from 'axios'
import store from '../store'
import { createUserSignInData, setSignInAttempted } from '../store/actions/user'
import {
  setUserNotebooks,
  updateUserNotebook,
  addUserNotebook,
  removeUserNotebook
} from '../store/actions/notebooks'
import {
  setUserNotepages,
  updateUserNotepage,
  addUserNotepage,
  removeUserNotepage,
  setUserShared
} from '../store/actions/notepages'

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

    window.sessionStorage.signedIn = JSON.stringify(signedIn.data)
    return signedIn.data
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

export async function initialize () {
  if (window.sessionStorage.signedIn) {
    const signedIn = JSON.parse(window.sessionStorage.signedIn)
    await retrieveUsersWork(signedIn.userId)
    store.dispatch(createUserSignInData(signedIn))
  }

  store.dispatch(setSignInAttempted())
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
    const noteItems = {}

    if (results.data.notebooks && results.data.notebooks.length) {
      const notebooks = results.data.notebooks.map((notebook) => {
        return {
          notebookId: notebook.id,
          title: notebook.title,
          updatedAt: notebook.updatedAt,
          starred: notebook.starred
        }
      })

      noteItems.notebooks = notebooks
      store.dispatch(setUserNotebooks(notebooks))
    }

    if (results.data.notepages && results.data.notepages.length) {
      const notepages = results.data.notepages.map((notepage) => {
        return {
          notepageId: notepage.id,
          title: notepage.title,
          updatedAt: notepage.updatedAt,
          starred: notepage.starred
        }
      })

      noteItems.notepages = notepages
      store.dispatch(setUserNotepages(notepages))
    }

    if (results.data.shared && results.data.shared.length) {
      const shared = results.data.shared.map((noteItem) => {
        return {
          notepageId: noteItem.id,
          title: noteItem.title,
          updatedAt: noteItem.updatedAt,
          starred: noteItem.starred
        }
      })

      noteItems.shared = shared
      store.dispatch(setUserShared(shared))
    }

    return noteItems
  } catch (error) {
    console.log(error)
  }
}

/**
 * Updates user's parent notebooks or free notepages
 *
 * @param {Object} details - in shape of { title, id, type, creator, updatedAt }
 * @param {Number} index - index of changed notebook or notepage (if just created, no index)
 *
 * @returns {Object}
 */
export async function updateUsersWork (details, index) {
  const endpoint = `/workspace/add-${details.type}/${details.creator}`
  // createNew tells server to either create a new NoteDetail or find existing one
  details.createNew = (index !== 0 && !index)

  try {
    const response = await axios.put(endpoint, details)

    if (details.type === 'notepage') {
      if (!details.createNew) {
        store.dispatch(updateUserNotepage(response.data, index))
      } else {
        store.dispatch(addUserNotepage(response.data))
      }
    } else if (details.type === 'notebook') {
      if (!details.createNew) {
        store.dispatch(updateUserNotebook(response.data, index))
      } else {
        store.dispatch(addUserNotebook(response.data))
      }
    }

    return response.data
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

export async function removeNoteItem (type, noteId, userId, index) {
  const endpoint = `/remove-item/${userId}/${type}/${noteId}`

  try {
    if (type === 'notebook') {
      store.dispatch(removeUserNotebook(index))
    } else if (type === 'notepage') {
      store.dispatch(removeUserNotepage(index))
    }

    await axios.put(endpoint)
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

export async function getStarredNoteItems (userId) {
  const endpoint = `/notepages/starred/${userId}`
  const endpoint2 = `/notebooks/starred/${userId}`

  try {
    const notepages = await axios.get(endpoint)
    const notebooks = await axios.get(endpoint2)

    return {
      notebooks: notebooks.data,
      notepages: notepages.data
    }
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

export async function addToUserShared (userId, noteId) {
  const endpoint = `/shared/${userId}/${noteId}`

  try {
    await axios.put(endpoint)
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

export async function getTrashNoteItems (userId) {
  const trashNotebooks = `/notebooks/trash/${userId}`
  const trashNotepages = `/notepages/trash/${userId}`

  try {
    const notebooks = await axios.get(trashNotebooks)
    const notepages = await axios.get(trashNotepages)

    return {
      notebooks: notebooks.data,
      notepages: notepages.data
    }
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}
