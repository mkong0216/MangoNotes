import axios from 'axios'
import { updateUsersWork } from './user'
import store from '../store'

/**
 * Makes a POST request to DB to create new Notebook object
 *
 * @param {Object} notebook - in shape of { title, creator, parentNotebook }
 *
 * @returns {Object} - in shape of { title, id, type, creator, updatedAt }
 */
export async function createNewNotebook (notebook) {
  const endpoint = '/notebook/new'

  try {
    const response = await axios.post(endpoint, notebook)
    const details = response.data

    if (!notebook.parentNotebook) {
      await updateUsersWork(details) 
    }

    return details
  } catch (error) {
    throw Error (error.response.data.error)
  }
}

/**
 * Gets notebooks and notepages of current notebook
 *
 * @param {String} notebookId
 * @param {String} userId
 *
 * @returns {Array} - [notebooks, notepages]
 */
export async function retrieveNotebook (notebookId, userId) {
  const endpoint = `/notebook/${notebookId}/${userId}`

  try {
    const response = await axios.get(endpoint)
    const noteDetails = filterNoteDetails(response.data)

    let noteItems = {
      notebooks: [],
      notepages: []
    }

    noteItems = Object.entries(noteDetails).reduce((obj, item) => {
      const details = item[1]

      if (details.type === 'notebook') {
        obj.notebooks.push(details)
      } else if (details.type === 'notepage') {
        obj.notepages.push(details)
      }

      return obj
    }, noteItems)

    return noteItems
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

/**
 * Updates notebook's title, parentNotebook, or contents.
 * 
 * @param {Object} notebook - in shape of { title, parentNotebook, notebookId }
 * @param {String} userId
 * @param {Array} contents - optional; is included if moving items into notebook
 */
export async function updateNotebook (notebook, userId, contents = false) {
  const endpoint = `/notebook/${notebook.notebookId}/${userId}`

  try {
    // Updating actual notebook
    const response = await axios.put(endpoint, { notebook, contents })
    const details = response.data
    // Update workspace if parentNotebook = null
    if (!notebook.parentNotebook) {
      const notebooks = store.getState().notebooks.userNotebooks
      const index = notebooks.findIndex(item => item.notebookId === notebook.notebookId)
      console.log(index)
      await updateUsersWork(details, index)
    }
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.message)
  }
} 

/**
 * Filters unnecessary fields from return value of GET request.
 *
 * @param {Object} details
 *
 * @returns {Object} - in shape of { parentNotebook, title, updatedAt, type, notebook/notepageId }
 */
function filterNoteDetails (details) {
  return details.map((detail) => {
    const id = (detail.type === 'notebook') ? 'notebookId' : 'notepageId'
    return {
      parentNotebook: detail.parentNotebook,
      title: detail.title,
      updatedAt: detail.updatedAt,
      type: detail.type,
      [id]: detail.id
    }
  })
}