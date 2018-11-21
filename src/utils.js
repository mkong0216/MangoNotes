export function updateBrowserHistory(state, url) {
  const pageTitle = `MangoNotes - ${state.id}`
  window.history.pushState(state, pageTitle, url)
}