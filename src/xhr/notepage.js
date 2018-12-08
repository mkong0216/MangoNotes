import axios from 'axios'
import { updateUsersWork, removeNoteItem } from './user'
import store from '../store'

/**
 * Makes a POST request to DB to create new Notepage object
 *
 * @param {Object} notepage - in shape of { title, creator, parentNotebook }
 *
 * @returns {Object} - in shape of { creator, notebookId, title, type, updatedAt }
 */
export async function createNewNotepage (notepage) {
  const endpoint = '/notepage/new'

  try {
    const response = await axios.post(endpoint, notepage)
    const details = response.data

    if (!notepage.parentNotebook) {
      await updateUsersWork(details)
    }

    return details
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

/**
 * Gets notepage from database
 *
 * @param {String} notepageId
 * @param {String} userId
 *
 * @returns {Object} - in shape of { parentNotebook, title, updatedAt, content }
 */
export async function retrieveNotepage (notepageId, userId) {
  const endpoint = `/notepage/${notepageId}/${userId}`

  try {
    const response = await axios.get(endpoint)

    const notepage = {
      title: response.data.title,
      parentNotebook: response.data.parentNotebook,
      updatedAt: response.data.updatedAt,
      content: response.data.content || ''
    }

    return notepage
  } catch (error) {
    throw Error(error.response.data.error)
  }
}

/**
 * Updates notepage in database
 *
 * @param {Object} notepage - in shape of { title, parentNotebook, content, notepageId }
 *
 * @returns {Object} - in shape of { title, creator, parentNotebook, type, id }
 */
export async function updateNotepage(notepage, userId) {
  const endpoint = `/notepage/${notepage.notepageId}/${userId}`

  try {
    const response = await axios.put(endpoint, notepage)
    const details = response.data

    if (!notepage.parentNotebook) {
      const notepages = store.getState().notepages.userNotepages
      const index = notepages.findIndex(item => item.notepageId === notepage.notepageId)
      await updateUsersWork(details, index)
    }

    return details
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

export async function retrieveRecentNotepages (userId) {
  const endpoint = `/notepages/recent/${userId}`

  try {
    const response = await axios.get(endpoint)
    return response.data
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}

/**
 * Moves a notepage into another notebook
 *
 * @param {Object} newParentNotebook - in shape of { id, title }
 * @param {Object} notepage - in shape of { notebookId, title, parentNotebook }
 * @param {String} userId
 *
 */
export async function moveNotepage (newParentNotebook, notepage, userId) {
  const noteId = notepage.notepageId || notepage.id
  const endpoint = `/move-notepage/${noteId}/${userId}`

  try {
    await axios.put(endpoint, { newParentNotebook, original: notepage.parentNotebook })

    if (!notepage.parentNotebook) {
      const notepages = store.getState().notepages.userNotepages
      const index = notepages.findIndex(item => item.notepageId === notepage.notepageId)
      await removeNoteItem('notepage', notepage.notepageId, userId, index)
    }
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.message)
  }
}

export async function addSharePermissions (noteId, permissionCode) {
  const endpoint = `/share/${noteId}`

  try {
    const response = await axios.put(endpoint, { permissionCode })
    console.log(response)
  } catch (error) {
    console.log(error)
    throw Error(error.response.data.error)
  }
}
