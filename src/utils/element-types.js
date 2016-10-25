import JsonML from 'jsonml-tools/jsonml-utils'

const inlineElements = ['link', 'em', 'strong', 'inlinecode', 'linebreak']
const blockElements = ['header', 'para', 'img', 'bulletlist', 'numberlist', 'listitem', 'code_block', 'blockquote']

export function isText (node) {
  return !(JsonML.isElement(node))
}

export function isInlineElement (node) {
  if (typeof node === 'undefined') return false
  if (
    inlineElements.indexOf(JsonML.getTagName(node)) > -1
  ) {
    return true
  } else if (blockElements.indexOf(JsonML.getTagName(node)) > -1) {
    return false
  } else {
    return false
  }
}

export function isBlockElement (node) {
  if (typeof node === 'undefined') return false
  return blockElements.indexOf(JsonML.getTagName(node)) > -1
}

export function isLeafElement (node) {
  if (typeof node === 'undefined') return false
  return JsonML.getChildren(node).length === 0
}
