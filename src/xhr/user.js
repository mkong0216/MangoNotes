import axios from 'axios'

/**
 * Authenticating user's login or register attempt
 * 
 * @param {Object} credentials - in shape of { username, password }
 * @param {String} submissionType - either 'login' or 'register'
 * 
 * Returns either an object in shape of { username, userId }, or an error message
 */
export async function authenticateUser (credentials, submissionType) {
  const endpoint = `/${submissionType}`

  try {
    const signedIn = await axios.post(endpoint, credentials)
    window.sessionStorage.userId = JSON.stringify(signedIn.data)
    return signedIn.data
  } catch (error) {
    console.log(error)
    throw Error (error.response.data.error)
  }
}