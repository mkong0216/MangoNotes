export function updateBrowserHistory(activeMenuItem, url) {
  const state = { id: activeMenuItem }
  const pageTitle = `MangoNotes - ${activeMenuItem}`

  window.history.pushState(state, pageTitle, url)
}