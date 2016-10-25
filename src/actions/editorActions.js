export const EDITOR_TOGGLE = 'EDITOR_TOGGLE'
export const EDITOR_LOAD_CONTENT = 'EDITOR_LOAD_CONTENT'
export const EDITOR_LOAD_EMOTES = 'EDITOR_LOAD_EMOTES'
export const EDITOR_LOAD_CONVERSATIONS = 'EDITOR_LOAD_CONVERSATIONS'

export function toggleEditor () {
  return { type: EDITOR_TOGGLE }
}

export function loadContent (position) {
  return { type: EDITOR_LOAD_CONTENT, position: position }
}

export function loadEmotes (position) {
  return { type: EDITOR_LOAD_EMOTES, position: position }
}

export function loadConversations (position) {
  return { type: EDITOR_LOAD_CONVERSATIONS, position: position }
}
