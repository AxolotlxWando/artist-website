import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import { markdown } from 'markdown'

import { TextNodeIterator } from 'util/dwModuleTextNodeIterator'

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
    this.states = {level: 0, posistion: 0}
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
function addPositionInfoToTextNode (stack, layout) {
  var rootLevel = stack.states.level
  var localHeight = 0

  var textNodes = new TextNodeIterator()

  /**
   * All nodes are on the same level
   * New nodes = rootLevel + current level/ intermediate elements + current node
   */
  while (stack.states.level >= rootLevel) {
    if (isTextNode(stack.getCurrentElement())) {
      textNodes.takeText(stack.getCurrentElement())
      JsonML.getAttributes(stack.getCurrentElement()).heightByLines

      stack.getCurrentIteration().states.counter++

      console.log('')
      console.log(textNodes.currentFloor)
      console.log('Added text node: ' + JsonML.toHTMLText(textNodes[textNodes.length - 1]))
    } else if (isInlineElement(stack.getCurrentElement())) {
      /* Inline tags = intermediate elements
       * Therefore adding tag to hierarchy, but ignore the tag itself
       * After adding to hierchy, adjust current posisiton in stack for following reads
       */
      textNodes.incrementLevel(stack.getCurrentElement())
      stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
      stack.getCurrentIteration().states.counter++
      stack.states.level++

      console.log('')
      console.log(textNodes.currentFloor)
      console.log('Added inline element: ' + JsonML.toHTMLText(stack.getCurrentElement()))
    } else if (isBlockElement(stack.getCurrentElement())) {
      // break before and after block element

      // Increment counter on current level, increment level
      // handover children to addPositionInfoToElement()
      stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
      stack.getCurrentIteration().states.counter++
      stack.states.level++
      var childHeight = addPositionInfoToElement(stack)
      localHeight += childHeight

      textNodes.breakFlag = true

      console.log('')
      console.log('Added block element: ' + JsonML.toHTMLText(stack.getCurrentElement()))
    }

    // Reduce level at reaching last element at current level
    if (stack.getCurrentIteration().states.counter >= stack.getCurrentIteration().length) {
      stack.states.level--
      textNodes.reduceLevel()
    }
  }
  stack.iterations[rootLevel].elements[stack.iterations[rootLevel]] = textNodes
  console.log(JsonML.toHTMLText, currentNode)

  JsonML.addAttributes(currentNode, {elHeight: elHeight})
  return elHeight
}

/**
 * addPositionInfoToElement()
 */
function addPositionInfoToElement (stack, layout) {
  var node = stack.getCurrentElement()
  var localHeight = 0
  var rootLevel = stack.states.level

  while (stack.states.level >= rootLevel) {
    for (
      stack.getCurrentIteration().states.counter = 0;
      stack.getCurrentIteration().states.counter < stack.getCurrentIteration().elements.length;
      stack.getCurrentIteration().states.counter++
    ) {
      if (isTextNode(stack.getCurrentElement()) || isInlineElement(stack.getCurrentElement())) {
        // Acutally still in the same loop, it's just for the sake of keeping more compack functions
        var childHeight = addPositionInfoToTextNode(stack, stack.states.currentPosition)
        localHeight += childHeight
        // To avoid counting height of nested elements multiple time
        // increment are handled in addPositionInfoToTextNode()
        // stack.states.currentPosition += childHeight 
      } else if (isBlockElement(stack.getCurrentElement())) {
        // Calculate child element's height if needed
        if (!JsonML.getAttribute(stack.getCurrentElement(), 'elHeightByLines')) {
          // Possible to calculate right now or not
          if (isLeafElement(stack.getCurrentElement())) {
            var div = document.createElement('div')
            div.innerHTML = markdown.toHTML(stack.getCurrentElement(), 'Maruku')
            var childHeight = Math.ceil(div.clientHeight / 9 * 1.5)
            localHeight += childHeight
            stack.states.currentPosition += childHeight
          } else {
            stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
            stack.states.level++
            currentHeight += addPositionInfoToElement(stack, stack.states.currentPosition)
          }
        }
        currentHeight += JsonML.getAttribute(stack.getCurrentElement(), 'elHeightByLines')
        stack.getCurrentIteration().states.counter++
      } else {
        stack.getCurrentIteration().states.counter++
        console.log('Error, dwModuleAddPosition.addPositionInfo(): unhandled elment type ' + JsonML.getTagName(stack.getCurrentElement()))
      }
    }
    JsonML.addAttributes(node, {elHeightByLines: currentHeight})
    stack.iterations.pop()
    stack.states.level--

    return currentHeight
  }

  return currentHeight
}

export default function addPositionInfo (node, layout) {
  var stack = new ElIterator()

  stack.iterations.push({elements: JsonML.getChildren(node), states: {currentPosisiton: 0, counter: 0}})
  stack.states.level = 0
  stack.getCurrentIteration().states.counter++

  addPositionInfoToElement(stack, 0)
}
