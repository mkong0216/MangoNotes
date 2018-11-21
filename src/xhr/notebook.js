import axios from 'axios'
import { updateUsersWork } from './user'

/**
 * Makes a POST request to DB to create new Notebook object
 * 
 * @param {Object} notebook - in shape of { title, creator, parentNotebook }
 * 
 */
export async function createNewNotebook (notebook) {
  const endpoint = '/notebook/new'

  try {
    const response = await axios.post(endpoint, notebook)
    const details = response.data

    if (!notebook.parentNotebook) {
      updateUsersWork(notebook.creator, details, 'notebook')
    }

    return details
  } catch (error) {
    throw Error (error.response.data.error)
  }
}