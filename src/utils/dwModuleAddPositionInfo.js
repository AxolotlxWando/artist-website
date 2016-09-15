import JsonML from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
JsonML = Object.assign(JsonML, JsonMLHTML)

import {
  getCurrentPage,
  getCurrentColumn
} from 'utils/dwModuleContainers'

import {
  isTextNode,
  isInlineElement,
  isBlockElement,
  isLeafElement
} from 'dwModuleElementTools'

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
 */
function addPositionInfoToTextNode (stack, startPosition) {
  var currentPosition = startPosition

  var textNode = ['textNode']
  var textNodeLevel = stack.states.level
  var textNodeCounter = stack.getCurrentCounter()

  JsonML.addAttributes(textNode, {
    elPosition: currentPosition,
    elPage: getCurrentPage(currentPosition),
    elColumn: getCurrentColumn(currentPosition)
  })
  textNode.push(stack.getCurrentElement())
  stack.getCurrentIteration().states.counter++

  var textNodeDomEl = JsonML.toHTMLText(textNode)
  while (stack.states.level >= textNodeLevel) {
    console.log(textNodeDomEl)
    if (isTextNode(stack.getCurrentElement())) {
      textNode.push([])
      console.log('Added text node: ' + JsonML.toHTMLText(stack.getCurrentElement()))
    } else if (isInlineElement(stack.getCurrentElement())) {
      console.log('Added text node: ' + JsonML.toHTMLText(stack.getCurrentElement()))
    } else if (isBlockElement(stack.getCurrentElement())) {

    }
  }
  stack.iterations[textNodeLevel].elements[textNodeCounter] = textNode
  console.log(JsonML.toHTMLText, textNode)

  var elHeight = currentPosition - startPosition
  JsonML.addAttributes(textNode, {elHeight: elHeight})
  return elHeight
}

/**
 * addPositionInfo()
 */
function addPositionInfoToElement (stack, currentPosition = 0) {
  var currentHeight = 0

  while (stack.states.level >= 0) {
    for (
      stack.getCurrentIteration().states.counter = 0;
      stack.getCurrentIteration().states.counter < stack.getCurrentIteration().elements.length;
      stack.getCurrentIteration().states.counter++
    ) {
      if (isTextNode(stack.getCurrentElement()) || isInlineElement(stack.getCurrentElement())) {
        currentHeight += addPositionInfoToTextNode(stack, currentPosition)
      } else if (isBlockElement(stack.getCurrentElement())) {
        // Calculate child element's height if needed
        if (!JsonML.getAttribute('elHeightByLines')) {
          // Possible to calculate right now or not
          if (isLeafElement(stack.getCurrentElement())) {
          } else {
            addPositionInfoToElement(stack, currentPosition)
          }
        }
        currentHeight += JsonML.getAttribute('elHeightByLines')
      } else {
        console.log('Error, dwModuleAddPosition.addPositionInfo(): unhandled elment type ' + JsonML.getTagName(stack.getCurrentElement()))
      }
    }
  }

  return currentHeight
}

function addPositionInfo (node, containers) {
  var stack = new ElIterator()

  stack.iterations.push({elements: JsonML.getChildren(node), states: {counter: 0}})
  stack.states.level = 0
  stack.getCurrentIteration().states.counter++

  addPositionInfoToElement(stack, 0)
}

export {addPositionInfo}
