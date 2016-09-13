import { markdown } from 'markdown'
import JsonML from 'jsonml-tools/jsonml-utils'

import addMeta from 'utils/dwModuleAddMeta'

import {
  createContainers,
  getCurrentPage,
  getCurrentColumn
} from 'utils/dwModuleContainers'

const inlineElements = ['link', 'em', 'string', 'inlinecode', 'linebreak']
const blockElements = ['header', 'para', 'img', 'bulletlist', 'numberlist', 'listitem', 'code_block']
function isInline (node) {
  if (
    !JsonML.isElement(node) &&
    inlineElements.indexOf(JsonML.getTagName(node)) > -1
  ) {
    return true
  } else if (blockElements.indexOf(JsonML.getTagName(node)) > -1) {
    return false
  } else {
    console.log('Error: unknown element type ' + JsonML.getTagName(node))
    return false
  }
}

function addPosition (node, containers) {
  var children = JsonML.getChildren(node)
  var currentPosition = 0
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      elPosition = 0
      if (!JsonML.isElement(children[i])) {
        children[i] = ['span', children[i]]
      }

      var child = children[i]

      // block level elements, add new line, create
      if (!JsonML.isElement(child)) {
      } else {
        var childElHeight = JsonML.getAttribute(child, 'elHeightByLines')
        if (!childElHeight) {
          wrapElement(child)
        }
        currentPosition += JsonML.getAttribute(child, 'elHeightByLines')
      }
    }
    JsonML.addAttributes(node, {elHeight: currentPosition})
  }
}

function flatten (node, layout) {
  var containers = createContainers(node, layout)
  var currentPosition = 0
  var totalLinesInPage = JsonML.getAttribute(getCurrentPage(containers, currentPosition), 'elHeightByLines')
}

function compile (textRaw, layout) {
  // var containers = createContainers(layout)
  // console.log(containers)
  // var normalisedContent = []

  var module = markdown.parse(textRaw, 'Maruku')
  module = addMeta(module, null)
  // module = wrapContent(module, layout)

  // console.log(JSON.stringify(module))
  return module
}

export {compile}

const DWModule = {compile}
export default DWModule
