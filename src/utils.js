/**
 * Given a Date object or string, display date in month/day/year format.
 * 
 * @param {Object or String} timestamp 
 */
export function getDateModified (timestamp) {
    if (typeof timestamp === 'string') {
        timestamp = new Date(timestamp)
    }

    const month = timestamp.getMonth() + 1
    const day = timestamp.getDate()
    const year = timestamp.getFullYear()

    return `${month}/${day}/${year}`
}
