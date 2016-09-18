import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import {
  getCurrentPage,
  getCurrentColumn
} from 'utils/dwModuleContainers'

export class TextNodeIterator {
  constructor (stack) {
    this.stack = stack
    this.breakFlag = true
    this.textNodes = []
    this.hierchy = []        // floor[{parent: <parent>, element: <element>}]
    this.currentFloor = null // this is the leaf element of intermediate elements
  }
  getLeafNode () {
    return this.floors[this.floors.length - 1].element
  }
  newTextNode () {
    this.breakFlag = false
    this.currentFloor = null

    // If starting new text node, create node
    var newTextNode = []
    newTextNode.push('textNode')
    JsonML.addAttributes(newTextNode, {
      elPosition: this.stack.states.currentPosition,
      elPage: getCurrentPage(this.stack.states.currentPosition),
      elColumn: getCurrentColumn(this.stack.states.currentPosition),
      elHeightByLines: 0
    })

    // Recreate hierarchy/ intermediate elements from where it was left off
    var tmpNode = newTextNode
    var tmpParent = null
    for (let i = 0; i < this.floors.length; i++) {
      // Make deep copies of old elment
      var clone = []
      // Copy tag name
      clone.push(JsonML.getTagName(this.hierarchy[i].element))
      // Copy attributes
      var attr = JsonML.getAttributes(this.hierchy[i].element)
      attr.elPosition = this.stack.states.currentPosition
      attr.elPage = getCurrentPage(this.stack.states.currentPosition)
      attr.elColumn = getCurrentColumn(this.stack.states.currentPosition)
      clone.addAttributes(attr)

      // Adding intemediate element
      tmpNode.push(clone)
      this.textNodes.floor[i] = {parent: tmpParent, element: tmpNode}

      // Persist hierarchy information
      tmpParent = tmpNode

      tmpNode = tmpNode[0]
    }
    this.textNodes.push(newTextNode)
    // Update current floor where new elements are to be added to
    this.currentFloor = tmpNode
  }
  takeText (text) {
    if (this.breakFlag) {
      this.newTextNode()
    }
    this.currentFloor.push(text)
  }
  incrementLevel (element) {
    // Persist hierarchy information
    this.hierarchy.push({parent: this.currentFloor, element: element})

    // Update current floor where new elements are to be added to
    this.currentFloor = this.hierarchy[this.hierarchy.length - 1].element
  }
  reduceLevel () {
    return
  }
}
