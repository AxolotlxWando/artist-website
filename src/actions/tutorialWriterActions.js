import fetch from 'utils/fetch'
import 'REDUX_README.md'

export const FILE_NEW_INVOCATION = 'FILE_NEW_INVOCATION'
export const FILE_NEW = 'FILE_NEW'
export const FILE_NEW_SUCCESS = 'FILE_NEW_SUCCESS'
export const FILE_NEW_FAILURE = 'FILE_NEW_FAILURE'

export const FILE_RENAME_INVOCATION = 'FILE_RENAME_INVOCATION'
export const FILE_RENAME = 'FILE_RENAME'
export const FILE_RENAME_SUCCESS = 'FILE_RENAME_SUCCESS'
export const FILE_RENAME_FAILURE = 'FILE_RENAME_FAILURE'

export const FILE_DELETE_INVOCATION = 'FILE_DELETE_INVOCATION'
export const FILE_DELETE = 'FILE_DELETE'
export const FILE_DELETE_SUCCESS = 'FILE_DELETE_SUCCESS'
export const FILE_DELETE_FAILURE = 'FILE_DELETE_FAILURE'

export const FILE_SAVE_INVOCATION = 'FILE_SAVE_INVOCATION'
export const FILE_SAVE = 'FILE_SAVE'
export const FILE_SAVE_SUCCESS = 'FILE_SAVE_SUCCESS'
export const FILE_SAVE_FAILURE = 'FILE_SAVE_FAILURE'

export const LAYOUT_SELECT = 'LAYOUT_SELECT'
export const LAYOUT_PREVIEW = 'LAYOUT_PREVIEW'
export const LAYOUT_APPLY = 'LAYOUT_APPLY'

/**
 * Selections
 */
export const SELECTION_SELECT = 'SELECTION_SELECT'
export const SELECTION_ADD = 'SELECTION_ADD'
export const SELECTION_REMOVE = 'SELECTION_REMOVE'

export function selectionSelect (id) {
  return { type: SELECTION_SELECT, id: id }
}

export function selectionAdd (id) {
  return { type: SELECTION_ADD, id: id }
}

export function selectionRemove (id) {
  return { type: SELECTION_REMOVE, id: id }
}

/**
 * Files
 */
export const FILE_OPEN = 'FILE_OPEN_ASYNC'
export const FILE_OPEN_REQUEST = 'FILE_OPEN_REQUEST'
export const FILE_OPEN_SUCCESS = 'FILE_OPEN_SUCCESS'

function fileOpenRequest (file) {
  return {
    type: FILE_OPEN_REQUEST,
    file: file
  }
}

function fileOpenSuccess (text) {
  return {
    type: FILE_OPEN_SUCCESS,
    text: text
  }
}

export function fileOpenAsync (file) {
  return (dispatch) => {
    dispatch(fileOpenRequest(file))
    return fetch('./REDUX_README.md')
    .then(
      (response) => {
        response.text().then(
          (text) => { dispatch(fileOpenSuccess(text)) }
        )
      },
      (reason) => {
        console.log('Opening file failed: ' + reason)
      }
    )
  }
}
