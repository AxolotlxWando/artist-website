import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import { markdown } from 'markdown'

import { TextNodeIterator } from 'utils/dwModuleTextNodeIterator'

import {
  isTextNode,
  isInlineElement,
  isBlockElement,
  isLeafElement
} from 'utils/dwModuleElementTools'

function pausecomp (millis) {
  var date = new Date()
  var curDate = null
  do { curDate = new Date() }
  while (curDate - date < millis)
}

/**
 * elIterator()
 *
 * Read & WRITE for the following:
 * child[], child.<object attribute>, child.push(), JsonML.addAttributes(child, {})
 *
 * for the some cases might need setCurrentChild()
 */
class ElIterator {
  constructor (_containers) {
    this.out = []
    this.iterations = []
    this.states = {level: 0, posistion: 0}
    this.containers = _containers
    /**
     * this.stack's shape:
     * this.stack[{elements: [<JsonML nodes>], states: {counter: 0}]
     */
  }
  write() {
    var parentEl = out
    for (let i = 0; i < this.iterations.length; i++) {
      parentEl = parentEl[this.]
    }
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
  var localHeight = 0
  var rootLevel = stack.states.level

  var textNodes = new TextNodeIterator(stack)

  /**
   * All nodes are on the same level
   * New nodes = rootLevel + current level/ intermediate elements + current node
   */
  while (stack.states.level > rootLevel || stack.getCurrentIteration().states.counter < stack.getCurrentIteration().elements.length) {
    // Reduce level at reaching last element at current level
    if (stack.getCurrentIteration().states.counter >= stack.getCurrentIteration().elements.length) {
      // This is needed for some clean up code to get executed (calculate textNode's height, move text elements into textNode)
      console.log('addPositionInfoToTextNode(): end of level')
      textNodes.closeTextNode()
      stack.iterations.pop()
      if (stack.states.level > rootLevel) stack.states.level--
      textNodes.reduceLevel()
      console.log('rootLevel: ' + rootLevel)
      console.log('stack.states.level: ' + stack.states.level)
      console.log('addPositionInfoToTextNode(): done end of level')
    } else {
      console.log('')
      console.log('addPositionInfoToTextNode(): level: ' + stack.states.level + ' of ' + stack.iterations.length)
      console.log('addPositionInfoToTextNode(): counter: ' + stack.getCurrentIteration().states.counter + ' of ' + stack.getCurrentIteration().elements.length)
      // pausecomp(50)

      if (isTextNode(stack.getCurrentElement())) {
        console.log('where\'s it lost??  001')
        var currentText = stack.getCurrentIteration().elements.splice(stack.getCurrentIteration().states.counter, 1)[0]
        console.log('currentIteration():')
        console.log(stack.getCurrentIteration().elements)
        localHeight += textNodes.takeText(currentText)
        // stack.getCurrentIteration.states.counter++

        console.log('isTextNode(): counter: ' + stack.getCurrentIteration().states.counter + ' of ' + stack.getCurrentIteration().elements.length)

        // stack.getCurrentIteration().states.counter++

        console.log('')
        console.log(textNodes.currentFloor)
        console.log('Added text node: ' + JsonML.toHTMLText(textNodes.textNodes[textNodes.textNodes.length - 1]))
      } else if (isInlineElement(stack.getCurrentElement())) {
        /* Inline tags = intermediate elements
         * Therefore adding tag to hierarchy, but ignore the tag itself
         * After adding to hierchy, adjust current posisiton in stack for following reads
         */

        console.log('')
        console.log('Added inline element (to intermediate elements): ' + JsonML.toHTMLText(stack.getCurrentElement()))

        stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
        console.log('stack.getCurrentElement(): ')
        console.log(stack.getCurrentElement())
        var currentElement = stack.getCurrentIteration().elements.splice(stack.getCurrentIteration().states.counter, 1)[0]
        // stack.getCurrentIteration.states.counter++
        console.log('incrementLevel: ')
        console.log(currentElement)
        textNodes.incrementLevel(currentElement)
        stack.states.level++
      } else if (isBlockElement(stack.getCurrentElement())) {
        console.log('')
        console.log('Encountered block element: ' + JsonML.toHTMLText(stack.getCurrentElement()))

        // Wrap up previous node, calculate height, move text elements into textNode
        textNodes.closeTextNode()

        // Increment counter on current level, increment level
        // handover children to addPositionInfoToElement()
        stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
        stack.getCurrentIteration().states.counter++
        stack.states.level++

        var childHeight = addPositionInfoToElement(stack)
        localHeight += childHeight

        // Set breakFlag to true so next entry get put in a new text node
        // also wrap up previous node, calculate height by it's end of input
        textNodes.break()
      } else {
        console.log('')
        console.log('addPositionInfoToTextNode(): Error: Unhandled element type: ' + stack.getCurrentElement())
      }

      console.log('addPositionInfoToTextNode(): end of tests')
    }
  }

  return localHeight
}

/**
 * addPositionInfoToElement()
 */
function addPositionInfoToElement (stack, layout) {
  var localHeight = 0
  var rootLevel = stack.states.level

  while (stack.states.level >= rootLevel) {
    for (
      stack.getCurrentIteration().states.counter = 0;
      stack.getCurrentIteration().states.counter < stack.getCurrentIteration().elements.length;
      stack.getCurrentIteration().states.counter++
    ) {
      console.log('')
      console.log('addPositionInfoToElement(): level: ' + stack.states.level + ' of ' + stack.iterations.length)
      console.log('addPositionInfoToElement(): counter: ' + stack.getCurrentIteration().states.counter + ' of ' + stack.getCurrentIteration().elements.length)
      // pausecomp(50)

      // concole.log('' + JsonML.toHTMLText(stack.getCurrentElement())
      console.log(JsonML.toHTMLText(stack.getCurrentElement()))
      if (isTextNode(stack.getCurrentElement()) || isInlineElement(stack.getCurrentElement())) {
        // Note acutally still in the same loop, it's just for the sake of keeping more compack functions
        localHeight += addPositionInfoToTextNode(stack, stack.states.currentPosition)
        // To avoid counting height of nested elements multiple time
        // increment are handled in addPositionInfoToTextNode()
        // stack.states.currentPosition += childHeight
      } else if (isBlockElement(stack.getCurrentElement())) {
        // Calculate child element's height if needed
        if (!JsonML.getAttribute(stack.getCurrentElement(), 'elHeightByLines')) {
          // Possible to calculate right now or not
          console.log('addPositionInfoToElement(): leafElement')
          if (isLeafElement(stack.getCurrentElement())) {
            console.log('addPositionInfoToElement(): leafElement')
            var div = document.createElement('div')
            div.innerHTML = markdown.toHTML(stack.getCurrentElement(), 'Maruku')
            var childHeight = Math.ceil(div.clientHeight / 9 * 1.5)
            stack.out.write()
            localHeight += childHeight
            stack.states.currentPosition += childHeight
            stack.getCurrentIteration().states.counter++
          } else {
            stack.iterations.push({elements: JsonML.getChildren(stack.getCurrentElement()), states: {counter: 0}})
            stack.getCurrentIteration().states.counter++
            stack.states.level++
            localHeight += addPositionInfoToElement(stack, stack.states.currentPosition)
          }
        }
      } else {
        stack.getCurrentIteration().states.counter++
        console.log('Error, dwModuleAddPosition.addPositionInfo(): unhandled elment type ' + JsonML.getTagName(stack.getCurrentElement()))
      }
    }
    console.log('addPositionInfoToElement(): end of level')
    stack.iterations.pop()
    stack.states.level--
    console.log('rootLevel: ' + rootLevel)
    console.log('stack.states.level: ' + stack.states.level)
  }

  return localHeight
}

export default function addPositionInfo (node, containers) {
  var stack = new ElIterator(containers)

  stack.iterations.push({elements: JsonML.getChildren(node), states: {currentPosisiton: 0, counter: 0}})
  stack.getCurrentIteration().states.counter++
  stack.states.level = 0

  var localHeight = addPositionInfoToElement(stack, 0)
  JsonML.addAttributes(node, {elHeightByLines: localHeight})
  JsonML.getChildren(node)[2] = ['does it work']
  console.log(JsonML.toHTMLText(node))
  console.log(node)
  return node
}
