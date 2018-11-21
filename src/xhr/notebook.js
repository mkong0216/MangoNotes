import axios from 'axios'
import { updateUsersWork } from './user'

/**
 * Makes a POST request to DB to create new Notebook object
 *
 * @param {Object} notebook - in shape of { title, creator, parentNotebook }
 *
 * @returns {Object} - in shape of { creator, notebookId, parentNotebook, title, type }
 */
export async function createNewNotebook (notebook) {
  const endpoint = '/notebook/new'

  try {
    const response = await axios.post(endpoint, notebook)
    const details = response.data

    if (!notebook.parentNotebook) {
      updateUsersWork(notebook.creator, details)
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
    })

    return noteItems
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

/**
 * Filters unnecessary fields from return value of GET request.
 *
 * @param {Object} details
 *
 * @returns {Object} - in shape of { parentNotebook, title, updatedAt, type, noteId }
 */
function filterNoteDetails (details) {
  return details.map((detail) => {
    return {
      parentNotebook: detail.parentNotebook,
      title: detail.title,
      updatedAt: detail.updatedAt,
      type: detail.type,
      noteId: detail.id
    }
  })
}