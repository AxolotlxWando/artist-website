import JsonML from 'jsonml-tools/jsonml-utils'

/*
 * Note that all images are treated as special case
 * Images should be given size and position info using columns number and height by lines
 */
const inlineElements = ['link', 'em', 'string', 'inlinecode', 'linebreak']
const blockElements = ['header', 'para', 'img', 'bulletlist', 'numberlist', 'listitem', 'code_block']

function isTextNode (node) {
  return !JsonML.isElement(node)
}

function isInlineElement (node) {
  if (
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

function isBlockElement (node) {
  return blockElements.indexOf(JsonML.getTagName(node)) > -1
}

function isLeafElement (node) {
  var children = JsonML.getChildren
  for (let i = 0; i < children.length; i++) {
    if (JsonML.isElement) {
      return false
    }
  }
  return true
}

export {isTextNode, isInlineElement, isBlockElement, isLeafElement}
