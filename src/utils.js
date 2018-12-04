import shortid from 'shortid'

export function getElAbsolutePos (el, includeScroll = false) {
    let pos = [0, 0]
  
    do {
      pos[0] += el.offsetLeft + (el.marginLeft || 0)
      pos[1] += el.offsetTop + (el.marginTop || 0)
  
      const parent = el.offsetParent
  
      if (includeScroll && parent) {
        pos[0] -= parent.scrollLeft
        pos[1] -= parent.scrollTop
      }
  
      el = parent
    } while (el)
  
    return pos
}

export const TYPE_NOTEBOOK = 'notebook'
export const TYPE_NOTEPAGE = 'notepage'

export function createPermissionCode (readOnly) {
  const code = shortid.generate()
  const extra = (readOnly) ? 0 : 1
  return code + extra
}
