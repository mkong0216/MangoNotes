import axios from 'axios'

export async function saveUserSettings (username, settings) {
  const endpoint = `/settings/${username}`

  try {
    const json = JSON.stringify(settings)
    const response = axios.put(endpoint, { userSettings: json })
    // const response = axios.put(endpoint, JSON.stringify(settings))
  } catch (error) {
    console.log(error)
    throw Error(error.response.data)
  }
}
