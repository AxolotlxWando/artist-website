/* global describe, it, expect */
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

import { ElIterator, prepareContentForViews } from 'dw-module/prepare-content-for-views'
import DWModule from 'dw-module/'

// var dwModule = new DWModule()
// dwModule.prepareContentForViews()
console.log('prepare-content-for-views.test.js')

describe('Eliterator', function () {
  const jsonMl = ['markdown', {withAttr: true}, ['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']]
  console.log('[\'markdown\', {withAttr: true}, [\'header\', {level: 1}, \'testing 123\'], [\'para\', \'blah blah!\'], [\'inlinecode\', \'2222222222 222!\']]')

  it('currIteration()', function () {
    var iterator = new ElIterator(jsonMl.slice())
    iterator.iterations.push({node: jsonMl, children: [], counter: 0})
    iterator.currIteration().children.push(JsonML.hasAttributes(jsonMl) ? jsonMl[2] : jsonMl[1])
    iterator.currIteration().children.push(JsonML.hasAttributes(jsonMl) ? jsonMl[3] : jsonMl[2])
    iterator.currIteration().children.push(JsonML.hasAttributes(jsonMl) ? jsonMl[4] : jsonMl[3])
    expect(iterator.currIteration()).toEqual({node: jsonMl, children: [['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']], counter: 0})
  })
  it('iteration.counter', function () {
    var iterator = new ElIterator(jsonMl.slice())
    iterator.iterations.push({node: jsonMl, children: [jsonMl[1]], counter: 0})
    expect(iterator.currIteration().counter).toBe(0)
    iterator.currIteration().counter += 1
    expect(iterator.currIteration().counter).toBe(1)
  })

  it('currElement()', function () {
    var iterator = new ElIterator(jsonMl.slice())
    // Root node
    iterator.iterations.push({node: null, children: [], counter: 0})
    iterator.currIteration().children.push(jsonMl)
    expect(iterator.currElement()).toEqual(jsonMl)

    iterator.iterations.push({node: iterator.currElement(), children: [], counter: 0})
    iterator.currIteration().children.push(JsonML.hasAttributes(jsonMl) ? jsonMl[2] : jsonMl[1])
    expect((iterator.currElement())).toEqual(['header', {level: 1}, 'testing 123'])
  })

  it('_newIteration()', function () {
    var iterator = new ElIterator(jsonMl.slice())

    // Root node
    iterator._newIteration(jsonMl)
    // Should be equaivalent to the lines
    // iterator.iterations.push({node: iterator.currElement(), children: [], counter: 0})
    // iterator.currIteration().children.push(JsonML.hasAttributes(jsonMl) ? jsonMl[2] : jsonMl[1])
    // iterator.currIteration().children.push(JsonML.hasAttributes(jsonMl) ? jsonMl[3] : jsonMl[2])

    expect(iterator.currIteration()).toEqual({node: jsonMl, children: [['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']], counter: 0})
    expect((iterator.currElement())).toEqual(['header', {level: 1}, 'testing 123'])
    iterator.incrementChild()
    expect((iterator.currElement())).toEqual(['para', 'blah blah!'])
    iterator.incrementChild()
    expect((iterator.currElement())).toEqual(['inlinecode', '2222222222 222!'])
    iterator.incrementChild()
    expect((iterator.currElement())).toBeUndefined()
  })

  it('incrementDepth()', function () {
    var iterator = new ElIterator(jsonMl.slice())
    iterator.incrementChildAndDepth()
    expect((iterator.currIteration())).toEqual({node: jsonMl, children: [['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']], counter: 0})
    iterator.incrementChild()
    iterator.incrementChildAndDepth()
    // const jsonMl = ['markdown', {withAttr: true}, ['header', {level: 1}, 'testing 123'], ['para', 'blah blah!']]
    expect((iterator.currIteration())).toEqual({node: jsonMl[3], children: ['blah blah!'], counter: 0})
  })

  it('iterations.node', function () {
    var content = jsonMl.slice()
    var iterator = new ElIterator(content)
    iterator.incrementChildAndDepth()
    expect(iterator.currElement()[0]).toEqual('header')

    iterator.currIteration().node.splice(
      iterator.currCounterReadOnly() + iterator._indexOffset(
        iterator.currIteration().node
      ),
      1
    )
    expect(content[2][0]).toEqual('para')
  })

  it('_addChild()', function () {
    var content = jsonMl.slice()
    var iterator = new ElIterator(content)
    iterator.incrementChildAndDepth()
    iterator.incrementChild()
    expect(iterator.currElement()[0]).toEqual('para')

    iterator._addChild(iterator.currIteration(), iterator.currCounterReadOnly(), ['newNode', [1, 2, 3]])

    iterator.reduceChild()
    expect((iterator.currElement())).toEqual(['newNode', [1, 2, 3]])
    expect(content[iterator.currCounterReadOnly() + iterator._indexOffset()]).toEqual(['newNode', [1, 2, 3]])
  })

  it('_createTextNode()', function () {
    const content = ['markdown', {withAttr: true}, ['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']]
    var iterator = new ElIterator(content)
    iterator.incrementChildAndDepth()

    /**
     * Create textnode to position of current counter
     * (without intermediate nodes)
     */
    iterator.incrementChild()
    expect(iterator.currElement()[0]).toEqual('para')
    iterator.incrementChildAndDepth()
    expect(iterator.currElement()).toEqual('blah blah!')

    iterator._createTextNode()
    // console.log(JsonML.toHTML(iterator.content))

    expect(iterator.currElement()).toEqual('blah blah!')
    expect(iterator.currIteration().children[iterator.currCounterReadOnly() - 1][0]).toEqual('textNode')

    var textNode = iterator.currIteration().children[iterator.currIteration().counter - 1]
    var textNodeIteration = {node: textNode, children: iterator._getChildren(textNode), counter: 0}
    // Adding text into textnode and removing text are suppose to be done in addText()
    // for completion purposes and clearity included here
    iterator._addChild(textNodeIteration, textNodeIteration.counter, iterator.currElement())

    // console.log(JsonML.toHTML(iterator.content))

    // This is now handled when the cursor when up one floor
    // iterator._removeChild(iterator.currIteration(), iterator.currCounterReadOnly())
    expect(iterator.currElement()).toEqual('blah blah!')
    iterator.incrementChild()
    expect(iterator.currElement()).toBeUndefined()

    /**
     * Testing cases where intermediate nodes are involved
     */
    iterator.reduceDepth()
    expect(iterator.currElement()[0]).toEqual('inlinecode')

    iterator.hierarchy.push({container: null, element: iterator.currElement()})

    iterator.incrementChildAndDepth()
    expect(iterator.currElement()).toEqual('2222222222 222!')

    iterator._createTextNode()
    var tmpIteration = iterator.iterations[iterator.iterations.length - 1 - 1]
    iterator.hierarchy[0].container = tmpIteration.children[tmpIteration.counter - 1 - 1]

    console.log(JsonML.toHTML(iterator.iterations[1].node))
    console.log('tmpIteration = ' + tmpIteration.node[0] + ', iterator.hierarchy[0].container = ' + iterator.hierarchy[0].container)
    console.log('')
    console.log('')

    expect(iterator.currElement()).toEqual('2222222222 222!')
    if (iterator.hierarchy.length <= 0) {
      // this will not be the case here, just putting here for information purpose
      expect(iterator.currIteration().children[iterator.currCounterReadOnly() - 1][0]).toEqual('textNode')
      console.log('_createTextNode(): hierarchy.length <= 0 when testing itermediate nodes, this shouldn\'t be the case something is wrong')
    } else {
      expect(iterator.hierarchy[0].container[0]).toEqual('textNode')
      expect(iterator.hierarchy[iterator.hierarchy.length - 1].element[0]).toEqual('inlinecode')
    }

    // or iterator.hierarchy[iterator.hierarchy.length - 1].node[iteration.hierarchy.length - 1]
    var hierarchyLeaf = iterator.hierarchy[iterator.hierarchy.length - 1]
    var textNodeLeafIteration = {node: hierarchyLeaf.element, children: iterator._getChildren(hierarchyLeaf.container), counter: 0}
    // Adding text into textnode and removing text are suppose to be done in addText()
    // for completion purposes and clearity included here
    console.log('adding current element ' + iterator.currElement() + ' to ' + textNodeLeafIteration.node[0])
    console.log('')
    console.log('')
    iterator._addChild(
      textNodeLeafIteration,
      textNodeLeafIteration.counter,
      iterator.currElement()
    )
    // ['markdown', {withAttr: true}, ['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']])
    expect(iterator.iterations[1].children[1][0]).toEqual('para')
    expect(iterator.iterations[1].children[1][1][0]).toEqual('textNode')
    expect(iterator.iterations[1].children[1][1][2]).toEqual('blah blah!')

    expect(iterator.iterations[1].children[2][0]).toEqual('textNode')
    expect(iterator.iterations[1].children[2][2][0]).toEqual('inlinecode')
    expect(iterator.iterations[1].children[2][2][1]).toEqual('2222222222 222!')

    expect(iterator.currElement()).toEqual('2222222222 222!')
    iterator.incrementChild()
    expect(iterator.currElement()).toBeUndefined()

    console.log(JsonML.toHTML(content))
    // console.log('')
    // console.log('')
  })

  it('addText()', function () {
    // if (true) return
    const content = ['markdown', {withAttr: true}, ['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']]
    var iterator = new ElIterator(content)
    expect(iterator.currElement()[0]).toEqual('markdown')

    iterator.incrementChildAndDepth()
    expect(iterator.currElement()[0]).toEqual('header')

    iterator.incrementChild()
    expect(iterator.currElement()[0]).toEqual('para')

    iterator.incrementChildAndDepth()
    expect((iterator.currElement())).toEqual('blah blah!')

    // HERE COMES THE REAL TEST!!!!!!
    console.log('addText(): realtest')
    console.log(JsonML.toHTML(iterator.currIteration().node))
    console.log(iterator.currElement())
    console.log('')
    console.log('')

    iterator.addText()
    console.log(JsonML.toHTML(content))
    console.log(JsonML.toHTML(iterator.iterations[1].node))

    expect(iterator.currElement()).toBeUndefined()

    console.log('hierarchy.length = ' + iterator.hierarchy.length)
    iterator.reduceDepth()
    expect(iterator.currElement()[0]).toEqual('inlinecode')
    iterator.hierarchy.push({container: iterator.currIteration().node, element: iterator.currElement()})
    iterator.incrementChildAndDepth()
    expect(iterator.currElement()).toEqual('2222222222 222!')

    console.log(JsonML.toHTML(content))
    iterator.addText()

    expect(iterator.currIteration().node[0]).toEqual('inlinecode')
    expect(iterator.currIteration().counter).toBe(0)
    expect(iterator.currElement()).toBeUndefined()

    var previousIteration = iterator.iterations[iterator.iterations.length - 1 - 1]
    expect(previousIteration.children[previousIteration.counter - 1][0]).toEqual('inlinecode')
    console.log(JsonML.toHTML(content))
    iterator.reduceDepth()
    expect(iterator.currIteration().node[0]).toEqual('markdown')
    expect(iterator.currElement()).toBeUndefined()
    console.log(JsonML.toHTML(content))
    if (true) return

    console.log(JsonML.toHTML(iterator.currIteration().node))
    console.log(iterator.currElement())
    console.log('')
    console.log('')

    expect(iterator.currElement()).toBeUndefined()
    iterator.reduceChild()
    expect(iterator.currCounterReadOnly()).toBe(0)

    // go up one level, instead of para, should have textNode
    iterator.reduceDepth()
    expect(iterator.currElement()).toBeUndefined()
    iterator.reduceChild()
    expect((iterator.currElement()[0])).toEqual('textNode')

    iterator.reduceDepth()
    iterator.reduceChild
  })

  it('prepareContentForViews()', function () {
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    const content = ['markdown', {withAttr: true}, ['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']]
    prepareContentForViews(content)
  })
  it('DWModule.compile()', function () {
    // const content = ['markdown', {withAttr: true}, ['header', {level: 1}, 'testing 123'], ['para', 'blah blah!'], ['inlinecode', '2222222222 222!']]
    // const contentRaw = (
    //   '# testing 123\n' +
    //   '\n' +
    //   'blah blah!\n' +
    //   '\n' +
    //   '`2222222222 222!`\n' +
    //   '\n'
    // )
    // var module = new DWModule(contentRaw)
    // module.jsonMl = content
// 
    // console.log('')
    // console.log('')
    // console.log('')
    // console.log('')
    // console.log('Compiling')
    // console.log('')
    // console.log('')
    // console.log('')
    // console.log('')
    // console.log('')
    // module.compile()
    // console.log('module.content = ')
    // console.log(JsonML.toHTML(module.jsonMl))
  })
})
