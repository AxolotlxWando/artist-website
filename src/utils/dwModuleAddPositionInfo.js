import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import {
  getCurrentPage,
  getCurrentColumn
} from 'utils/dwModuleContainers'

import {
  isTextNode,
  isInlineElement,
  isBlockElement,
  isLeafElement
} from 'utils/dwModuleElementTools'

/**
 * elIterator()
 *
 * Read & WRITE for the following:
 * child[], child.<object attribute>, child.push(), JsonML.addAttributes(child, {})
 *
 * for the some cases might need setCurrentChild()
 */
class ElIterator {
  constructor () {
    this.iterations = []
    this.states = {level: 0}
    /**
     * this.stack's shape:
     * this.stack[{elements: [<JsonML nodes>], states: {counter: 0}]
     */
  }
  getCurrentIteration () {
    return this.iterations[this.states.level]
  }
  getCurrentCounter () {
    return this.iterations[this.states.level].states.counter
  }
  getCurrentElement () {
    return this.iterations[this.states.level].elements[this.getCurrentCounter()]
  }
}

/**
 * addPositionInfoToTextNode()
 *
 * What's happening is that all consecutive textnodes and all elements in the
 * text node block shares the same level, the whole thing is a flattened block
 */
function addPositionInfoToTextNode (stack, startPosition) {
  var currentPosition = startPosition
  var currentHeight = 0
  var rootLevel = stack.states.level

  var beakFlag = true
  var textNodes = []
  var currentNode = []

  class textNodeIterator  {
    constructor (stack, currentPosition) {
      this.breakFlag = true
      this.textNodes = []
      this.floors = []        // floor[{parent: <parent>, element: <element>}]
      this.currentFloor = null
      this.leafNode = null
    }
    getLeafNode (){
      return floors[floors.length - 1].element
    }
    takeInlineEl (element) {
      if (this.breakFlag) {
        this.breakFlag = false

        var newTextNode = []
        newTextNode.push('textNode')
        JsonML.addAttributes(newTextNode, {
          elPosition: currentPosition,
          elPage: getCurrentPage(currentPosition),
          elColumn: getCurrentColumn(currentPosition)
        })

        var tmpNode = newTextNode
        var tmpParent = null
        for(let i = 0; i < floors.length; i++) {
          var clone = []
          clone.push(JsonML.getTagName(floors[i].element))
          var attr = JsonML.getAttributes(floors[i].element)
          attr.elPosition = currentPosition,
          attr.elPage: getCurrentPage(currentPosition),
          attr.elColumn: getCurrentColumn(currentPosition)
          clone.addAttributes(attr)

          tmpNode.push(clone);
          floor[i] = {parent: tmpParent, element: tmpNode}

          tmpParent = tmpNode
          tmpNode = tmpNode[0]
        }
        this.textNodes.push(newTextNode)
      }
    }
    incrementLevel (element) {
      this.floors.push({parent: currentFloor, element: element})
      this.currentFloor = this.currentFloor[0]
    }
  }
  var hierarchy = new Hierarchy()

  /**
   * All nodes are on the same level
   * New nodes = rootLevel + current level/ intermediate elements + current node
   */
  while (stack.states.level >= rootLevel) {
    if (isTextNode(stack.getCurrentElement())) {
      textNodes[textNodes.length - 1].push(stack.getCurrentElement())
      stack.getCurrentIteration().states.counter++

      console.log('')
      console.log(hierarchy)
      console.log(currentNode)
      console.log('Added text node: ' + JsonML.toHTMLText(textNodes[textNodes.length - 1]))
    } else if (isInlineElement(stack.getCurrentElement())) {
      /* Inline tags = intermediate elements
       * Therefore adding tag to hierarchy, but ignore the tag itself
       * After adding to hierchy, adjust current posisiton in stack for following reads
       */
      textNodeIterator.incrementLevel([
        JsonML.getTagName(stack.getCurrentElement()),
        JsonML.getAttributes(stack.getCurrentElement())
      ])
      stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
      stack.getCurrentIteration().states.counter++
      stack.states.level++

      console.log('Added inline element: ' + JsonML.toHTMLText(stack.getCurrentElement()))
    } else if (isBlockElement(stack.getCurrentElement())) {
      stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
      textNodes.push(stack.getCurrentElement())
      stack.getCurrentIteration().states.counter++
      stack.states.level++
      textNodeIterator.currentNode.elHeight += addPositionInfoToElement(stack, currentPosition)

      textNodeIterator.break()

      console.log('Added block element: ' + JsonML.toHTMLText(stack.getCurrentElement()))
    }
    if (stack.getCurrentIteration().states.counter >= stack.getCurrentIteration().length) {
      stack.states--
      currentNode
      if (hierarchy.length > 0) hierarchy.pop()
    }
  }currentNode
  stack.iterations[rootLevel].elements[stack.iterations[rootLevel]] = textNodes
  console.log(JsonML.toHTMLText, currentNode)

  var elHeight = currentPosition - startPosition
  JsonML.addAttributes(currentNode, {elHeight: elHeight})
  return elHeight
}

/**
 * addPositionInfoToElement()
 */
function addPositionInfoToElement (stack, startPosition = 0) {
  var currentPosition = startPosition
  var currentHeight = 0
  var rootLevel = stack.states.level

  while (stack.states.level >= rootLevel) {
    for (
      stack.getCurrentIteration().states.counter = 0;
      stack.getCurrentIteration().states.counter < stack.getCurrentIteration().elements.length;
      stack.getCurrentIteration().states.counter++
    ) {
      if (isTextNode(stack.getCurrentElement()) || isInlineElement(stack.getCurrentElement())) {
        stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
        stack.states.level++
        currentHeight += addPositionInfoToTextNode(stack, currentPosition)
      } else if (isBlockElement(stack.getCurrentElement())) {
        // Calculate child element's height if needed
        if (!JsonML.getAttribute(stack.getCurrentElement(), 'elHeightByLines')) {
          // Possible to calculate right now or not
          if (isLeafElement(stack.getCurrentElement())) {
          } else {
            stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
            stack.states.level++
            addPositionInfoToElement(stack, currentPosition)
          }
        }
        currentHeight += JsonML.getAttribute(stack.getCurrentElement(), 'elHeightByLines')
      } else {
        console.log('Error, dwModuleAddPosition.addPositionInfo(): unhandled elment type ' + JsonML.getTagName(stack.getCurrentElement()))
      }
      stack.getCurrentIteration().states.counter++
    }
    stack.iterations.pop()
    stack.states.level--
  }

  return currentHeight
}

export default function addPositionInfo (node, containers) {
  var stack = new ElIterator()

  stack.iterations.push({elements: JsonML.getChildren(node), states: {counter: 0}})
  stack.states.level = 0
  stack.getCurrentIteration().states.counter++

  addPositionInfoToElement(stack, 0)
}
