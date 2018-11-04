// Given a Date object, returns the string month/day/year
export function getDateModified (timestamp) {
    const month = timestamp.getMonth() + 1
    const day = timestamp.getDate()
    const year = timestamp.getFullYear()

    return `${month}/${day}/${year}`
}
