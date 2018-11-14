import axios from 'axios'

/**
 * Saves notepage to server
 * 
 * @param {Object} notepage - includes { title, parentNotebook, creator, timestamp }
 * @param {String} method - either PUT or POST
 */
export async function saveNotepageToServer (notepage) {
  const endpoint = `/${notepage.creator}/notepage/new`
  try {
    const newNotepage = await axios.post(endpoint, notepage)
    
    // If it is a free notepage, add to user's notepages
    if (newNotepage && !notepage.parentNotebook) {
      const endpoint2 = `/${notepage.creator}/workspace/add-notepage`
      const updated = await axios.put(endpoint2, newNotepage.data)
      return updated
    }
  
    return newNotepage
  } catch (error) {
    console.log(error)
  }
}

