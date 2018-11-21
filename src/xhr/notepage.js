import axios from 'axios'
import { updateUsersWork } from './user'

/**
 * Makes a POST request to DB to create new Notepage object
 *
 * @param {Object} notepage - in shape of { title, creator, parentNotebook }
 *
 * @returns {Object} - in shape of { creator, notebookId, parentNotebook, title, type }
 */
export async function createNewNotepage (notepage) {
  const endpoint = '/notepage/new'

  try {
    const response = await axios.post(endpoint, notepage)
    const details = response.data

    if (!notepage.parentNotebook) {
      updateUsersWork(notepage.creator, details)
    }

    return details
  } catch (error) {
    throw Error (error.response.data.error)
  }
}