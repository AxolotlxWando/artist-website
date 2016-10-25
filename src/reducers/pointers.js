import {
  VIEW_POINTER_SEEK,
  HIGHLIGHT_POINTER_SEEK,
  ACTIVE_POINTER_SEEK
} from 'actions/pointersActions'

export default function pointers (state = {viewPosition: -1, highlightPosition: -1, activePosition: -1}, action) {
  switch (action.type) {
    case VIEW_POINTER_SEEK:
      return Object.assign({}, state, {viewPosition: action.position})
    case HIGHLIGHT_POINTER_SEEK:
      return Object.assign({}, state, {highlightPosition: action.position})
    case ACTIVE_POINTER_SEEK:
      return Object.assign({}, state, {activePosition: action.position})
    default:
      return state
  }
}
