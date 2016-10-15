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
    this.containers = stack.containers
    this.startPosition = this.stack.states.currentPosition
    this.breakFlag = true
    this.textNodes = []
    this.hierarchy = []        // floor[{parent: <parent>, element: <element>}]
    this.currentFloor = null // this is the leaf element of intermediate elements
  }
  getLeafNode () {
    if (this.hierarchy.length <= 0) {
      return this.textNodes[this.textNodes.length - 1]
    }
    return this.hierarchy[this.hierarchy.length - 1].element
  }
  createTextNode () {
    this.breakFlag = false
    this.currentFloor = null

    var newTextNode = []
    newTextNode.push('textNode')

    JsonML.addAttributes(newTextNode, {
      elPosition: this.stack.states.currentPosition,
      elPage: getCurrentPage(this.containers, this.stack.states.currentPosition),
      elColumn: getCurrentColumn(this.containers, this.stack.states.currentPosition)
      // All inline elements are seen as one block need for more fine grained selection is reserved for now
      // elHeightByLines.....
    })

    // Recreate hierarchy/ intermediate elements from where it was left off
    var tmpNode = newTextNode
    var lastNode = tmpNode
    for (let i = 0; i < this.hierarchy.length; i++) {
      console.log('')
      console.log('newTextNode(): hierarchy: ' + i)

      // Make deep copies of old elment
      var clone = []
      // Copy tag name
      console.log(this.hierarchy[i].element)
      clone.push(JsonML.getTagName(this.hierarchy[i].element))
      // Copy attributes
      var attr = JsonML.getAttributes(this.hierarchy[i].element)
      attr.elPosition = this.stack.states.currentPosition
      attr.elPage = getCurrentPage(this.containers, this.stack.states.currentPosition)
      attr.elColumn = getCurrentColumn(this.containers, this.stack.states.currentPosition)
      JsonML.addAttributes(clone, attr)

      // Adding intemediate element
      tmpNode.push(clone)

      // Persist hierarchy information
      this.hierarchy[i] = {parent: lastNode, element: tmpNode}
      lastNode = tmpNode

      tmpNode = tmpNode[tmpNode.length - 1]
    }
    this.textNodes.push(newTextNode)
    // Update current floor where new elements are to be added to
    this.currentFloor = tmpNode

    // And finally insert into position in current element's place, (adding counter to take into account of the inserted textNode)
    console.log('insert text node:')
    console.log(this.textNodes[this.textNodes.length - 1])
    console.log('current iteration:')
    console.table(this.stack.getCurrentIteration().elements)
    this.stack.getCurrentIteration().elements.splice(this.stack.getCurrentIteration().states.counter, 0, this.textNodes[this.textNodes.length - 1])
    console.log('current iteration (after):')
    console.table(this.stack.getCurrentIteration().elements)
    this.stack.getCurrentIteration().states.counter += 2
  }
  closeTextNode () {
    if (this.textNodes.length <= 0) return
    var textNodeHeight = this.stack.states.currentPosisiton - this.startPosition
    JsonML.addAttributes(this.textNodes[this.textNodes.length - 1], {elHeightByLines: textNodeHeight})
  }
  takeText (text) {
    if (this.breakFlag) {
      this.createTextNode()
    }

    for (let i = 0; i < this.hierarchy.length; i++) {
      console.log(JsonML.toHTMLText(this.hierarchy[i].element))
    }
    this.currentFloor.push(text)
    return 0.123
  }
  break () {
    this.breakFlag = true
  }
  incrementLevel (element) {
    // Persist hierarchy information
    this.hierarchy.push({parent: this.currentFloor, element: element})

    // Update current floor where new elements are to be added to
    this.currentFloor = this.hierarchy[this.hierarchy.length - 1].element
  }
  reduceLevel () {
    if (this.hierarchy.length <= 0) return
    this.currentFloor = this.hierarchy[this.hierarchy.length - 1].parent
    this.hierarchy.pop()
    return
  }
}
