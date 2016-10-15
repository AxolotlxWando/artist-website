import { combineReducers } from 'redux'

import { markdown } from 'markdown'
import DWModule from 'dw-module/'

import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import {
  FILE_OPEN_REQUEST,
  FILE_OPEN_SUCCESS,
  WORKFLOW_SEEK_BY_ELPATH
} from 'actions/tutorialWriterActions'

function tutorialWriterLayout (state = {paperHeight: 0, paperWidth: 0, pages: []}, action) {
  switch (action.type) {
    case FILE_OPEN_SUCCESS:
      return action.layout
    default:
      return state
  }
}

function tutorialWriterContent (state = {text: '', jsonMlRaw: [], html: ''}, action) {
  switch (action.type) {
    case FILE_OPEN_SUCCESS:
      return Object.assign({}, state, {
        text: action.text,
        jsonMlRaw: markdown.parse(action.text, 'Maruku'),
        html: markdown.toHTML(action.text, 'Maruku')
      })
    default:
      return state
  }
}

function tutorialWriterContentModule (state = {jsonMl: []}, action) {
  switch (action.type) {
    case FILE_OPEN_SUCCESS:
      var module = new DWModule(action.text, action.layout)
      const content = ['markdown', {withAttr: true}, ['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']]
      module.jsonMl = content
      module.compile()
      console.log('abc')
      console.log(module.jsonMl)
      console.log(JsonML.toHTML(module.jsonMl))
      return module
    default:
      return state
  }
}
function tutorialWriterWorkflowMode (state = {progress: 0}, action) {
  switch (action.type) {
    case WORKFLOW_SEEK_BY_ELPATH:
      return Object.assign({}, state, {
        progress: 100
      })
    default:
      return state
  }
}

function tutorialWriterViewMode (state = {page: 0}, action) {
  switch (action.type) {
    default:
      return state
  }
}

function tutorialWriter (state = {rawContent: {text: '', jsonMlRaw: [], html: ''}, module: {jsonMl: []}, layout: {paperHeight: 0, paperWidth: 0, pages: []}}, action) {
  switch (action.type) {
    case FILE_OPEN_REQUEST:
      console.log('000')
      return Object.assign({}, state, {file: ''})
    case FILE_OPEN_SUCCESS:
      console.log('001')
      return Object.assign({}, state, {
        rawContent: tutorialWriterContent(state.content, action),
        module: tutorialWriterContentModule(state.module, action),
        layout: tutorialWriterLayout(state.layout, action)
      })
    default:
      return combineReducers(
        {
          file: (state = {}) => state,
          rawContent: (state = {}) => state,
          module: (state = {}) => state,
          layout: (state = {}) => state,
          workflowMode: tutorialWriterWorkflowMode,
          viewMode: tutorialWriterViewMode
        }
      )(state, action)
  }
}

export default tutorialWriter
