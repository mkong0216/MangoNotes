import axios from 'axios'

export async function saveUserSettings (username, settings) {
  const endpoint = `/settings/${username}`

  try {
    const json = JSON.stringify(settings)
    await axios.put(endpoint, { userSettings: json })
  } catch (error) {
    console.log(error)
    throw Error(error.response.data)
  }
}
