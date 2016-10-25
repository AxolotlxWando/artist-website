import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import {isText, isInlineElement, isBlockElement, isLeafElement} from 'utils/element-types.js'

import 'github-markdown-css/github-markdown.css'

// import { markdown } from 'markdown'

/**
 * The idea of how {node: [], children: [], counter: 0} works:
 * Edit node object to change the actual content's jsonMl stack
 * where children is maintained and only exist in the iterator therfore popping
 * slicing the children object will no change the actual content, it's used for
 * looping/ iteration purposes.
 * Lastly counter again represents current progress in the children elements,
 * also for iteration's purpose only too
 */
class ElIterator {
  constructor (jsonMl, _layout) {
    this.content = jsonMl
    console.log('_layyyyyout!!!!!' + _layout)
    this.layout = _layout
    this.currPosition = 0
    this.iterations = []
    // Being a explicit boundary, giveing some ease of mind
    this.iterations.push({node: undefined, children: [this.content], counter: 0})

    this.textNodeFlag = false
    this.breakFlag = false
    this.textNodeLeafIteration = undefined
    this.resumeFlag = 0
    this.hierarchy = []
    this.hierarchy.push()
  }

  currIteration () {
    return this.iterations[this.iterations.length - 1]
  }

  /* Use currIteration().counter for r/w access instead
   * currCounterReadOnly()
   * For use of manipulating this.node, since there are extra offsets from tag
   * and attributes objects, currIndexReadOnly() should be used
   */
  currCounterReadOnly () {
    return this.currIteration().counter
  }
  currIndexReadOnly () {
    return this.currIteration().counter + (
      JsonML.hasAttributes(this.currIteration().node) ? 2 : 1
    )
  }
  _indexOffset (node = this.currIteration().node) {
    try {
      return JsonML.hasAttributes(node) ? 2 : 1
    } catch (err) {
      console.log('error caused by node:')
      for (let i = 0; i < node.length; i++) {
        console.log(node[i])
      }
      throw err
    }
  }

  currElement () {
    if (!this.currIteration() || !this.currIteration().children) {
      return undefined
    }
    return this.currIteration().children[this.currIteration().counter]
  }

  incrementChild () {
    this.currIteration().counter++
  }
  reduceChild () {
    if (this.currIteration().counter <= 0) {
      console.log('WARNING: reducing child passing origin, action being ignored')
      return
    }
    this.currIteration().counter--
  }
  _actualChildren () {
    if (this.iterations.length < 1) return
    var lastIteration = this.iterations[this.iterations.length - 2]
    return this.currIteration().node[lastIteration.counter + this._indexOffset(this.currIteration().node)]
  }
  _addChild (iteration, counter, child) {
    if (iteration.children) {
      iteration.children.splice(counter, 0, child)
    }

    iteration.node.splice(
      counter + this._indexOffset(
        iteration.node
      ),
      0,
      child
    )

    // Fix offset from insert
    if (counter <= iteration.counter) {
      iteration.counter++
    }
  }
  _removeChild (iteration, counter) {
    iteration.children.splice(counter, 1)
    iteration.node.splice(
      counter + this._indexOffset(
        iteration.node
      ),
      1
    )
    // Fix offset from insert
    if (counter <= this.currCounterReadOnly()) {
      iteration.counter--
      // console.log('counter--')
      // console.log('')
      // console.log('')
    }
    // console.log('_removeChild():')
    // console.log('Removing ' + removed)
    // console.log(JsonML.toHTML(this.content))
    // console.log('')
    // console.log('')
  }

  _getChildren (node) {
    var children = []
    var i = JsonML.hasAttributes(node) ? 2 : 1
    for (; i < node.length; i++) {
      children.push(node[i])
    }
    return children
  }
  _newIteration (node) {
    var iteration = {node: node, children: [], counter: 0}
    var i = JsonML.hasAttributes(node) ? 2 : 1
    for (; i < node.length; i++) {
      iteration.children.push(node[i])
    }
    this.iterations.push(iteration)
  }
  incrementDepth () {
    // this.hierarchy.push({container: this.currIteration().node, element: this.currElement()})
    this._newIteration(this.currElement())
    // fill this;
  }
  incrementChildAndDepth () {
    // this.hierarchy.push({container: this.currIteration().node, element: this.currElement()})
    var currElement = this.currElement()
    this.incrementChild()
    this._newIteration(currElement)
  }
  closeNode () {
    console.log('layout = ' + this.layout)
    console.log('layout exists? ' + (typeof this.layout !== 'undefined'))
    if (typeof this.currIteration().node !== 'undefined') {
      console.log('currIteration() = ' + (!isText(this.currIteration().node)) ? (this.currIteration().node[0]) : this.currIteration().node)
    }
    console.log('++++++++++ reduceDepth calculate height +++++++++++')
    var element = this.currIteration().node
    if (this.textNodeFlag && this.hierarchy.length === 0) {
      console.log('this.currIteration().node = ' + this.currIteration().node[0])
      if (typeof this.layout !== 'undefined') {
        var source = '' + JsonML.toHTMLText(this.textNodeLeafIteration.node)
        if (typeof source !== undefined) {
          source = source.replace(/<textnode [^>]*>(.*?)<\/textnode>/, function (m, p1) { return p1 })
        }
        console.log('source    = ' + source)
        // console.log('iteration = ' + JsonML.toHTMLText(this.iterations[0].children[0]))
        var tmpElement = document.createElement('div')
        tmpElement.setAttribute('style',
                                'visibility:visible;margin:0px;padding:0px;' +
                                'front-size: ' + this.layout.pages[0].columns[0].fontSize + ';' +
                                'line-spacing: 1.5;' +
                                // 'height: ' + this.layout.pages[0].columns[0].height + 'em;' +
                                'width: ' + this.layout.pages[0].columns[0].width + 'em;'
                               )
        tmpElement.className = 'markdown-body'
        tmpElement.innerHTML = source
        console.log(tmpElement)
        document.body.appendChild(tmpElement)
        console.log('height of textnode = ' + tmpElement.clientHeight)
        var height = tmpElement.clientHeight
        JsonML.addAttributes(this.textNodeLeafIteration.node, {elHeight: height / 9})
        this.currPosition += (height / 9)
        console.log('')
        console.log('')
        tmpElement.remove()
      } else {
        console.log('layout not defined, skip calculating elHeight')
        console.log('')
        console.log('')
      }
    } else if (isBlockElement(element)) {
      var start = JsonML.getAttribute(element, 'elPosition')
      JsonML.addAttributes(this.currIteration().node, {elHeight: this.currPosition - start})
    } else if (
      typeof this.currIteration().node !== 'undefined' &&
      JsonML.getTagName(this.currIteration().node) === 'markdown'
    ) {
      JsonML.addAttributes(this.currIteration().node, {elHeight: this.currPosition})
    }
  }
  reduceDepth () {
    console.log('reduceDepth():')
    console.log('this.textNodeFlag = ' + this.textNodeFlag)
    console.log('this.hierarchy.length = ' + this.hierarchy.length)
    console.log('this.currIteration().node ' + (
      typeof this.currIteration().node !== 'undefined' ? this.currIteration().node[0] : this.currIteration().node
    ))
    console.log('')

    this.closeNode()

    if (this.textNodeFlag) {
      // var tmpNode = ['div'].splice(1, 0, this.textNodeLeafIteration.children)
      // console.log('++++++++++ reduceDepth calculate height +++++++++++')
      // console.log('textNodeLeafIteration = {')
      // console.log('  node:')
      // console.log(JsonML.toHTML(this.textNodeLeafIteration.node))
      // console.log('')
      // console.log('  children:')
      // console.log(JsonML.toHTML(this.textNodeLeafIteration.children))
      // console.log('}')
      // console.log('')
      // console.log(JsonML.toHTML(tmpNode))
      // console.log('')
      // console.log('')
      if (this.hierarchy.length > 1) {
        this.iterations.pop()
        this.hierarchy.pop()

        var leafElement = this.hierarchy[this.hierarchy.length - 1].element
        var leafElementChildren = this._getChildren(leafElement)
        var leafElementCounter = leafElementChildren.length - 1 < 0 ? 0 : leafElementChildren.length - 1
        this.textNodeLeafIteration = {
          node: leafElement,
          counter: leafElementCounter
        }
        if (leafElementChildren.length) {
          this.textNodeLeafIteration.children = leafElementChildren
        }
      } else if (this.hierarchy.length === 1) {
        // console.log('reduceDepth():')
        // console.log('currElement() = ' + this.currElement())
        // console.log('this.textNode = ' + this.textNode)
        // console.log('')
        // console.log('')

        // console.log('reduceDepth():')
        // console.log('currIteration() = ' + this.currIteration().node[0])
        // console.log('removing ' + this.currIteration().children[this.currCounterReadOnly() - 1])
        // console.log('')
        // console.log('')

        this.textNodeFlag = false
        this.textNodeLeafIteration = undefined

        this.iterations.pop()
        this._removeChild(this.currIteration(), this.currCounterReadOnly() - 1)
        this.hierarchy.pop()
      } else {
        this.textNodeFlag = false
        this.iterations.pop()
      }
    } else {
      this.iterations.pop()
    }
  }

  _createTextNode () {
    var newTextNode = []
    newTextNode.push('textNode')
    newTextNode.push({
      elPosition: this.currPosition,
      // elPage: 0,
      // elColumn: 0,
      elHeight: 0
      // elHeightByLines
    })
    /* JsonML.addAttributes(newTextNode, {
       elPosition: 0,
       elPage: 0,
       elColumn: 0,
       elHeight: 0
    }) */

    // indice is 0-origin (-1), we cound backwards from the last one
    // therefore do not need to consider invalid first node being {null, jsonMl}
    // console.log(JsonML.toHTML(this.content))
    var rootLevel = this.iterations.length - this.hierarchy.length - 1
    var rootIteration = this.iterations[rootLevel]
    var rootIterationCounter = rootIteration.counter + (this.hierarchy.length <= 0 ? 0 : -1)

    // if (this.hierarchy && this.hierarchy[0] && this.hierarchy[0].container) {
    //   console.log('   hierarchy = ')
    //   for (let i = 0; i < this.hierarchy[0].container.length; i++) {
    //     console.log(this.hierarchy[0].container[i])
    //   }
    // }

    // console.log('')
    // console.log('   this.iterations.length = ' + this.iterations.length)
    // console.log('   rootlevel = ' + rootLevel)
    // console.log('   rootIterationCounter = ' + rootIterationCounter)
    // console.log('   rootIteration = {node:' + rootIteration.node[0] + ' children: [.... [' + rootIteration.children[rootIterationCounter] + '], ...]')
    // console.log('')
    // console.log('')

    // WRONG
    // No need to duplicate hierarchy if its the only (first one to be precise)
    // Always duplicate hierarchy, otherwise all child nodes automatically get duplicated
    // this is always done (copying child element) explicitly to avoid ambiguity
    if (this.textNodeFlag) {
      // Duplicate hierarchy, note they're DEEP COPIES of intermediate nodes
      var tmpNode = rootIteration.node
      for (let i = 0; i < this.hierarchy.length; i++) {
        var clone = []
        clone.push(JsonML.getTagName(this.hierarchy[i].element))
        if (JsonML.hasAttributes(this.hierarchy[i].element)) {
          JsonML.addAttributes(
            clone,
            JsonML.getAttributes(this.hierarchy[i].element)
          )
        }

        // Persist hierarchy information
        this.hierarchy[i] = {container: tmpNode, element: clone}

        // Adding intermediate node
        tmpNode.push(clone)
        tmpNode = tmpNode[tmpNode.length - 1]
      }
    }

    // if (this.hierarchy && this.hierarchy[0] && this.hierarchy[0].container) {
    //   console.log('   hierarchy = ')
    //   for (let i = 0; i < this.hierarchy[0].container.length; i++) {
    //     console.log(this.hierarchy[0].container[i])
    //   }
    // }

    var branch
    /**
     * Intermediate elements exists:
     *   branch <-> Intermediate nodes <-> newTextNode
     * Do not exist:
     *   branch <-> newTextNode
     */
    if (this.hierarchy.length > 0) {
      // branch = this.hierarchy[0].element
      // var leafElementIteration = {node: this.hierarchy[this.hierarchy.length - 1].element, children: [], counter: 0}
      // this._addChild(leafElementIteration, 0, newTextNode)
      branch = newTextNode
      var branchIteration = {node: branch, children: [], counter: 0}
      // console.log('_createTextNode(): adding ' + this.hierarchy[0].element + ' to ' + branchIteration.node[0])
      // console.log('')
      // console.log('')
      this._addChild(branchIteration, 0, this.hierarchy[0].element)

      var leafElement = this.hierarchy[this.hierarchy.length - 1].element
      var leafElementChildren = this._getChildren(leafElement)
      var leafElementCounter = leafElementChildren.length - 1 < 0 ? 0 : leafElementChildren.length - 1
      this.textNodeLeafIteration = {
        node: leafElement,
        counter: leafElementCounter
      }
      if (leafElementChildren.length) {
        this.textNodeLeafIteration.children = leafElementChildren
      }
      console.log('_creatTextNode(): setting leafNodeIteration:')
      console.log(' INTERMEDIATE NODES, ' + this.currElement())
      console.log(' leafElement          = ' + JsonML.toHTMLText(leafElement))
      console.log(' leafElementCounter   = ' + leafElementCounter)
      console.log(' leafElement = ' + JsonML.toHTMLText(leafElement))
      console.log('')
      console.log('')
      // console.log(JsonML.toHTML(['inlinenode']))
      // console.log(JsonML.toHTML(leafElementContainer))
      // console.log('_createTextNode():')
      // console.log('this.textNodeLeafIteration = ')
      // console.log(this.textNodeLeafIteration.node[0])
      // console.log(this.textNodeLeafIteration.children)
      // console.log(this.textNodeLeafIteration.counter)
      // console.log('')
      // console.log('')
    } else {
      branch = newTextNode

      var leafElement2 = newTextNode
      var leafElementChildren2 = this._getChildren(leafElement2)
      var leafElementCounter2 = leafElementChildren2.length - 1 < 0 ? 0 : leafElementChildren2.length - 1
      this.textNodeLeafIteration = {
        node: leafElement2,
        counter: leafElementCounter2
      }
      if (leafElementChildren2.length) {
        this.textNodeLeafIteration.children = leafElementChildren2
      }
      console.log('_creatTextNode(): setting leafNodeIteration:')
      console.log(' NO HIERARCHY, ' + this.currElement())
      console.log(' leafElement          = ' + JsonML.toHTMLText(leafElement2))
      console.log(' leafElementCounter   = ' + leafElementCounter2)
      console.log(' leafElement = ' + JsonML.toHTMLText(leafElement2))
      console.log('')
      console.log('')
    }

    // console.log('_createTextNode(): adding ' + branch[0] + ' to ' + rootIteration.node[0])
    // console.log('')
    // console.log('')

    this._addChild(rootIteration, rootIterationCounter, branch)

    this.textNodeFlag = true
    this.breakFlag = false
  }
  addText () {
    // console.log('000: ')
    // console.log(JsonML.toHTML(this.content))
    // console.log('')
    // Always have a textNode when a text entry is encountered
    // console.log('textNodeFlag = ' + this.textNodeFlag)
    if (!this.textNodeFlag) {
      // this.closeNode()
      this._createTextNode()
    }
    // Textnodes exist in two forms, one with inline hierarchy, one without
    // when nested inside intermediate inline elements, this.textNodeLeafIteration
    // is declared to manage manipulation to the textnode
    // console.log('this.textNodeLeafIteration || this.hierarchy.length > 0) = ' + (this.textNodeLeafIteration || this.hierarchy.length > 0))
    // console.log('')
    if (typeof this.textNodeLeafIteration !== 'undefined' || this.hierarchy.length > 0) {
      if (typeof this.textNodeLeafIteration === 'undefined' || !(this.hierarchy.length > 0)) {
        console.log('addText(): error, either this.texnode is uninitialised and/ or hierarchy is not setup correctly.')
        console.log('this.texNodeLeafIteration = ' + JsonML.toHTMLText(this.textNodeLeafIteration.node))
        console.log('this.hierarchy.length = ' + this.hierarchy.length)
        console.log('')
      }
      var leafIterationCounter = 0
      if (typeof this.textNodeLeafIteration.children !== 'undefined') {
        var length = this.textNodeLeafIteration.children !== 'undefined' ? 0 : this.textNodeLeafIteration.children.length
        leafIterationCounter = length - 1 < 0 ? 0 : length - 1
      }
      console.log('addText(): adding ' + this.currElement() + '  to ' + this.textNodeLeafIteration.node[0])
      console.log('')
      this._addChild(this.textNodeLeafIteration, leafIterationCounter, this.currElement())
    } else {
      // console.log(JsonML.toHTML(this.content))
      var textNode = this.currIteration().children[this.currIteration().counter - 1]
      // console.log('textNode = ' + textNode)
      // console.log(JsonML.toHTML(this.content))
      // console.log('')
      var textNodeIteration = {node: textNode, children: this._getChildren(textNode), counter: 0}
      textNodeIteration.counter = textNodeIteration.children.length - 1 < 0 ? 0 : textNodeIteration.children.length - 1
      // console.log('textNodeIteration.counter = ' + textNodeIteration.counter)
      // console.log('textNodeIteration.children = ')
      // console.log(textNodeIteration.children)
      // console.log('textNodeIteration.children.length' + textNodeIteration.children.length)
      this._addChild(textNodeIteration, textNodeIteration.counter, this.currElement())

      // console.log(JsonML.toHTML(this.content))
    }
    // console.log('removing ' + this.currIteration().children[this.currCounterReadOnly()] + ' from ' + this.currIteration().node[0])
    // console.log('')
    // console.log('')
    this._removeChild(this.currIteration(), this.currCounterReadOnly())
    this.incrementChild()

    // this.currFloor().element.push(this.currElement())
  }
  addInlineElement () {
    this.hierarchy.push({container: this.currIteration().node, element: this.currElement()})
    if (typeof this.textNodeFlag) {
      var leafElement = this.hierarchy[this.hierarchy.length - 1].element
      var leafElementChildren = this._getChildren(leafElement)
      var leafElementCounter = leafElementChildren.length - 1 < 0 ? 0 : leafElementChildren.length - 1
      this.textNodeLeafIteration = {
        node: leafElement,
        counter: leafElementCounter
      }
      if (leafElementChildren.length) {
        this.textNodeLeafIteration.children = leafElementChildren
      }
    }
    this.incrementChildAndDepth()
  }
  processBlockElement () {
    JsonML.addAttributes(this.currElement(), {elPosition: this.currPosition})

    if (typeof this.layout !== 'undefined') {
      var tmpNode = [JsonML.getTagName(this.currElement())]
      if (JsonML.hasAttributes(this.currElement())) {
        JsonML.addAttributes(tmpNode, JsonML.getAttributes(this.currElement()))
      }
      var source = JsonML.toHTMLText(tmpNode)
      var tmpElement = document.createElement('div')
      tmpElement.setAttribute('style',
                              'visibility:visible;margin:0px;padding:0px;' +
                              'front-size: ' + this.layout.pages[0].columns[0].fontSize + ';' +
                              'line-spacing: 1.5;' +
                              // 'height: ' + this.layout.pages[0].columns[0].height + 'em;' +
                              'width: ' + this.layout.pages[0].columns[0].width + 'em;'
                             )
      tmpElement.className = 'markdown-body'
      tmpElement.innerHTML = source
      console.log(tmpElement)
      document.body.appendChild(tmpElement)
      console.log('height of textnode = ' + tmpElement.clientHeight)
      var height = tmpElement.clientHeight
      this.currPosition += (height / 9)
      tmpElement.remove()
    }

    if (isLeafElement(this.currElement())) {
      this.incrementChild()
    } else {
      this.incrementChildAndDepth()
    }
  }
}

function prepareContentForViews (jsonMl, layout) {
  var iterator = new ElIterator(jsonMl, layout)
  iterator.incrementChildAndDepth()

  // console.log(iterator.currIteration())
  // console.log(iterator.currElement())
  var safeGuard = 0
  while (iterator.currIteration() && safeGuard < 999) {
    while (iterator.currElement() && safeGuard < 999) {
      // console.log(iterator.currElement())
      // console.log(isText(iterator.currElement()))
      // console.log(isInlineElement(iterator.currElement()))
      // console.log(isBlockElement(iterator.currElement()))
      // Check text node
      if (isText(iterator.currElement())) {
        // iterator._createTextNode()
        console.log('prepareContentForViews(): adding text')
        console.log(iterator.currElement()[0])
        console.log(' ')
        iterator.addText()
      } else if (isInlineElement(iterator.currElement())) {
        // Protential children to cause increment of depth
        console.log('prepareContentForViews(): adding inlineElement')
        console.log(iterator.currElement()[0])
        console.log(' ')
        iterator.addInlineElement()
      } else if (isBlockElement(iterator.currElement())) {
        // Protential children to cause increment of depth
        console.log('prepareContentForViews(): processing block')
        console.log(iterator.currElement()[0])
        console.log(' ')
        iterator.processBlockElement()
      } else {
        console.log('prepareContentForViews(): Error, unknown element: ' + iterator.currElement())
      }
      // iterator._incrementChild()
      safeGuard++
    }
    iterator.reduceDepth()
    safeGuard++
  }

  console.log('prepareContentForViews(): content = ' + JsonML.toHTMLText(iterator.content))
  return iterator.content
}

export { ElIterator, prepareContentForViews }
