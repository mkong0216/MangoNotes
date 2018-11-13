import axios from 'axios'
import store from './store'
import { createNewNotebook } from './store/actions/notebooks';

/**
 * Saves notepage to server
 * 
 * @param {Object} notepageData - includes { title, creator, parentNotebookId }
 * @param {String} method - either PUT or POST
 */
export async function saveNotepageToServer (notepageData, method) {
  let endpoint = `/${notepageData.creator}/notepage/`

  try {
    endpoint += 'new'
    // Create new notepage on db
    const response = await axios.post(endpoint, notepageData)
    console.log(response)
    // if (response.data === 'OK' && !notepageData.parentNotebook) {
    //   const endpoint2 = `/${notepageData.creator}/workspace/new-notepage`

    //   const updated = await axios.put(endpoint2)
    //   store.dispatch(createNewNotebook(notepageData))

    //   return updated
    // }
    return response
  } catch (error) {
    throw Error (error)
  }
}