import { markdown } from 'markdown'

import {
  FILE_OPEN_REQUEST,
  FILE_OPEN_SUCCESS
} from 'actions/tutorialWriterActions'

export default function tutorialWriter (state = {file: '', text: '', json: '', html: '', blah: ''}, action) {
  switch (action.type) {
    case FILE_OPEN_REQUEST:
      return Object.assign({}, state, {file: action.file})
    case FILE_OPEN_SUCCESS:
      return Object.assign({}, state, {
        text: action.text,
        json: markdown.parse(action.text),
        html: markdown.toHTML(action.text, 'Gruber'),
        blah: ':-D'
      })
    default:
      return state
  }
}
