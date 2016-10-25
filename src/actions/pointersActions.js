export const VIEW_POINTER_SEEK = 'VIEW_POINTER_SEEK'
export const HIGHLIGHT_POINTER_SEEK = 'HIGHLIGHT_POINTER_SEEK'
export const ACTIVE_POINTER_SEEK = 'ACTIVE_POINTER_SEEK'

export function viewPointerSeek (position) {
  return { type: VIEW_POINTER_SEEK, position: position }
}

export function highlightPointerSeek (position) {
  return { type: HIGHLIGHT_POINTER_SEEK, position: position }
}

export function activePointerSeek (position) {
  return { type: ACTIVE_POINTER_SEEK, position: position }
}
