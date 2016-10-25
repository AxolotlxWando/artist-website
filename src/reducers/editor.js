import {
  EDITOR_TOGGLE,
  EDITOR_LOAD_CONTENT,
  EDITOR_LOAD_EMOTES,
  EDITOR_LOAD_CONVERSATIONS
} from 'actions/editorActions'

export default function editor (state = {collapsed: false, mode: ''}, action) {
  switch (action.type) {
    case EDITOR_TOGGLE:
      return Object.assign({}, state, {collapsed: !state.collapsed})
    case EDITOR_LOAD_CONTENT:
      return Object.assign({}, state, {mode: 'content'})
    case EDITOR_LOAD_EMOTES:
      return Object.assign({}, state, {mode: 'emotes'})
    case EDITOR_LOAD_CONVERSATIONS:
      return Object.assign({}, state, {mode: 'conversations'})
    default:
      return state
  }
}
