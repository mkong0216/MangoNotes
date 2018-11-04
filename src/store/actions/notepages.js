import { CREATE_NEW_NOTEPAGE } from './index'

export function createNewNotePage (notepageDetails) {
  return {
    type: CREATE_NEW_NOTEPAGE,
    notepageDetails
  }
}
