// JsonMl utils
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

// Artist Website - Utils
import { isBlockElement, isLeafElement } from 'utils/element-types'

export default function flatten (jsonMl) {
  // return [
  //   ['div', {elPosition: 0, elHeight: 2}],
  //   ['textNode', {elPosition: 4, elHeight: 4}],
  //   ['header', {elPosition: 31, elHeight: 5}],
  //   ['div', {elPosition: 31, elHeight: 9}],
  //   ['img', {elPosition: 31, elHeight: 3}]
  // ]

  if (typeof jsonMl === 'undefined') {
    return []
  }

  var section = []
  function addNodes (node, array) {
    console.log('timeline(): node.length = ' + node.length)
    for (let i = 0; i < node.length; i++) {
      var curr = node[i]
      // console.log('curr = ' + JsonML.isElement(curr) ? curr[0] : curr)
      // console.log('JsonML.isElement(curr) = ' + JsonML.isElement(curr))
      // console.log('isBlockElement(JsonML.getTagName(curr)) = ' + isBlockElement(curr))
      // console.log('JsonML.getTagName(curr) === \'textNode \'' + JsonML.getTagName(curr) === 'textNode')
      if (
        JsonML.isElement(curr) &&
        isBlockElement(curr) ||
        JsonML.getTagName(curr) === 'textNode'
      ) {
        array.push(
          [JsonML.getTagName(curr), JsonML.getAttributes(curr)]
        )
        if (isBlockElement(curr) && !isLeafElement(curr)) {
          addNodes(curr, array)
        }
      }
    }
  }

  addNodes(jsonMl, section)
  console.log('flatten(): section = ' + section)
  return section
}
