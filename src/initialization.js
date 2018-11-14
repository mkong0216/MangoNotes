import store from './store'
import { saveNotepageToServer } from './xhr/notepage'
import { getUserData } from './xhr/user';

export async function initialize () {
    // If previously logged in, log in and get user data
    if (window.localStorage.signedInUser) {
        const userData = await getUserData(window.localStorage.signedinUser)
        initNotepagesSubscriber()
        return userData
    }
}

let notepages = store.getState().notepages.userNotepages
let oldNumNotepages = notepages.length || 0

export function initNotepagesSubscriber () {
    store.subscribe(() => {
        const state = store.getState().notepages
        updateIfNewNotepage(state)
    })
}

function updateIfNewNotepage (state) {
    const numNotepages = state.userNotepages.length
    if (numNotepages > oldNumNotepages) {
        const newNotepage = state.userNotepages[numNotepages - 1]
        if (newNotepage.parentNotebook === 'My Workspace') {
            newNotepage.parentNotebook = null
        }

        saveNotepageToServer(newNotepage)

        oldNumNotepages = numNotepages
    }
}