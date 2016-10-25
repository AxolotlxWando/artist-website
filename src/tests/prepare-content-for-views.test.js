/* global describe, it, expect */

// Utils
import { markdown } from 'markdown'
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

// Artist Website
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

    // console.log(JsonML.toHTML(iterator.iterations[1].node))
    // console.log('tmpIteration = ' + tmpIteration.node[0] + ', iterator.hierarchy[0].container = ' + iterator.hierarchy[0].container)
    // console.log('')
    // console.log('')

    expect(iterator.currElement()).toEqual('2222222222 222!')
    if (iterator.hierarchy.length <= 0) {
      // this will not be the case here, just putting here for information purpose
      expect(iterator.currIteration().children[iterator.currCounterReadOnly() - 1][0]).toEqual('textNode')
      // console.log('_createTextNode(): hierarchy.length <= 0 when testing itermediate nodes, this shouldn\'t be the case something is wrong')
    } else {
      expect(iterator.hierarchy[0].container[0]).toEqual('textNode')
      expect(iterator.hierarchy[iterator.hierarchy.length - 1].element[0]).toEqual('inlinecode')
    }

    // or iterator.hierarchy[iterator.hierarchy.length - 1].node[iteration.hierarchy.length - 1]
    var hierarchyLeaf = iterator.hierarchy[iterator.hierarchy.length - 1]
    var textNodeLeafIteration = {node: hierarchyLeaf.element, children: iterator._getChildren(hierarchyLeaf.container), counter: 0}
    // Adding text into textnode and removing text are suppose to be done in addText()
    // for completion purposes and clearity included here
    // console.log('adding current element ' + iterator.currElement() + ' to ' + textNodeLeafIteration.node[0])
    // console.log('')
    // console.log('')
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

    // console.log(JsonML.toHTML(content))
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
    // console.log('addText(): realtest')
    // console.log(JsonML.toHTML(iterator.currIteration().node))
    // console.log(iterator.currElement())
    // console.log('')
    // console.log('')

    iterator.addText()
    // console.log(JsonML.toHTML(content))
    // console.log(JsonML.toHTML(iterator.iterations[1].node))

    expect(iterator.currElement()).toBeUndefined()

    // console.log('hierarchy.length = ' + iterator.hierarchy.length)
    iterator.reduceDepth()
    expect(iterator.currElement()[0]).toEqual('inlinecode')
    iterator.hierarchy.push({container: iterator.currIteration().node, element: iterator.currElement()})
    iterator.incrementChildAndDepth()
    expect(iterator.currElement()).toEqual('2222222222 222!')

    // console.log(JsonML.toHTML(content))
    iterator.addText()

    expect(iterator.currIteration().node[0]).toEqual('inlinecode')
    expect(iterator.currIteration().counter).toBe(0)
    expect(iterator.currElement()).toBeUndefined()

    var previousIteration = iterator.iterations[iterator.iterations.length - 1 - 1]
    expect(previousIteration.children[previousIteration.counter - 1][0]).toEqual('inlinecode')
    // console.log(JsonML.toHTML(content))
    iterator.reduceDepth()
    expect(iterator.currIteration().node[0]).toEqual('markdown')
    expect(iterator.currElement()).toBeUndefined()
    // console.log(JsonML.toHTML(content))
    if (true) return

    // console.log(JsonML.toHTML(iterator.currIteration().node))
    // console.log(iterator.currElement())
    // console.log('')
    // console.log('')

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
    // var raw = '# [![redux](https://camo.githubusercontent.com/f28b5bc7822f1b7bb28a96d8d09e7d79169248fc/687474703a2f2f692e696d6775722e636f6d2f4a65567164514d2e706e67)](http://redux.js.org)\r\n\r\nRedux is a predictable state container for JavaScript apps.  \r\n(If you\'re looking for a WordPress framework, check out [Redux Framework](https://reduxframework.com/).)\r\n\r\nIt helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. On top of that, it provides a great developer experience, such as [live code editing combined with a time traveling debugger](https://github.com/gaearon/redux-devtools).\r\n\r\nYou can use Redux together with [React](https://facebook.github.io/react/), or with any other view library.  \r\nIt is tiny (2kB, including dependencies).\r\n\r\n[![build status](https://img.shields.io/travis/reactjs/redux/master.svg?style=flat-square)](https://travis-ci.org/reactjs/redux)\r\n[![npm version](https://img.shields.io/npm/v/redux.svg?style=flat-square)](https://www.npmjs.com/package/redux)\r\n[![npm downloads](https://img.shields.io/npm/dm/redux.svg?style=flat-square)](https://www.npmjs.com/package/redux)\r\n[![redux channel on discord](https://img.shields.io/badge/discord-%23redux%20%40%20reactiflux-61dafb.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bZ6au5t)\r\n[![#rackt on freenode](https://img.shields.io/badge/irc-%23rackt%20%40%20freenode-61DAFB.svg?style=flat-square)](https://webchat.freenode.net/)\r\n[![Changelog #187](https://img.shields.io/badge/changelog-%23187-lightgrey.svg?style=flat-square)](https://changelog.com/187)\r\n\r\n>**New! Learn Redux from its creator:  \r\n>[Getting Started with Redux](https://egghead.io/series/getting-started-with-redux) (30 free videos)**\r\n\r\n### Testimonials\r\n\r\n>[\u201CLove what you\'re doing with Redux\u201D](https://twitter.com/jingc/status/616608251463909376)  \r\n>Jing Chen, creator of Flux\r\n\r\n>[\u201CI asked for comments on Redux in FB\'s internal JS discussion group, and it was universally praised. Really awesome work.\u201D](https://twitter.com/fisherwebdev/status/616286955693682688)  \r\n>Bill Fisher, author of Flux documentation\r\n\r\n>[\u201CIt\'s cool that you are inventing a better Flux by not doing Flux at all.\u201D](https://twitter.com/andrestaltz/status/616271392930201604)  \r\n>Andr\u00E9 Staltz, creator of Cycle\r\n\r\n### Developer Experience\r\n\r\nI wrote Redux while working on my React Europe talk called [\u201CHot Reloading with Time Travel\u201D](https://www.youtube.com/watch?v=xsSnOQynTHs). My goal was to create a state management library with minimal API but completely predictable behavior, so it is possible to implement logging, hot reloading, time travel, universal apps, record and replay, without any buy-in from the developer.\r\n\r\n### Influences\r\n\r\nRedux evolves the ideas of [Flux](http://facebook.github.io/flux/), but avoids its complexity by taking cues from [Elm](https://github.com/evancz/elm-architecture-tutorial/).  \r\nWhether you have used them or not, Redux only takes a few minutes to get started with.\r\n\r\n### Installation\r\n\r\nTo install the stable version:\r\n\r\n```\r\nnpm install --save redux\r\n```\r\n\r\nThis assumes you are using [npm](https://www.npmjs.com/) as your package manager.  \r\nIf you don\'t, you can [access these files on npmcdn](https://npmcdn.com/redux/), download them, or point your package manager to them.\r\n\r\nMost commonly people consume Redux as a collection of [CommonJS](http://webpack.github.io/docs/commonjs.html) modules. These modules are what you get when you import `redux` in a [Webpack](http://webpack.github.io), [Browserify](http://browserify.org/), or a Node environment. If you like to live on the edge and use [Rollup](http://rollupjs.org), we support that as well.\r\n\r\nIf you don\'t use a module bundler, it\'s also fine. The `redux` npm package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the [`dist` folder](https://npmcdn.com/redux/dist/). They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. For example, you can drop a UMD build as a [`<script>` tag](https://npmcdn.com/redux/dist/redux.js) on the page, or [tell Bower to install it](https://github.com/reactjs/redux/pull/1181#issuecomment-167361975). The UMD builds make Redux available as a `window.Redux` global variable.\r\n\r\nThe Redux source code is written in ES2015 but we precompile both CommonJS and UMD builds to ES5 so they work in [any modern browser](http://caniuse.com/#feat=es5). You don\'t need to use Babel or a module bundler to [get started with Redux](https://github.com/reactjs/redux/blob/master/examples/counter-vanilla/index.html).\r\n\r\n#### Complementary Packages\r\n\r\nMost likely, you\'ll also need [the React bindings](https://github.com/reactjs/react-redux) and [the developer tools](https://github.com/gaearon/redux-devtools).\r\n\r\n```\r\nnpm install --save react-redux\r\nnpm install --save-dev redux-devtools\r\n```\r\n\r\nNote that unlike Redux itself, many packages in the Redux ecosystem don\'t provide UMD builds, so we recommend using CommonJS module bundlers like [Webpack](http://webpack.github.io) and [Browserify](http://browserify.org/) for the most comfortable development experience.\r\n\r\n### The Gist\r\n\r\nThe whole state of your app is stored in an object tree inside a single *store*.  \r\nThe only way to change the state tree is to emit an *action*, an object describing what happened.  \r\nTo specify how the actions transform the state tree, you write pure *reducers*.\r\n\r\nThat\'s it!\r\n\r\n```js\r\nimport { createStore } from \'redux\'\r\n\r\n/**\r\n * This is a reducer, a pure function with (state, action) => state signature.\r\n * It describes how an action transforms the state into the next state.\r\n *\r\n * The shape of the state is up to you: it can be a primitive, an array, an object,\r\n * or even an Immutable.js data structure. The only important part is that you should\r\n * not mutate the state object, but return a new object if the state changes.\r\n *\r\n * In this example, we use a `switch` statement and strings, but you can use a helper that\r\n * follows a different convention (such as function maps) if it makes sense for your\r\n * project.\r\n */\r\nfunction counter(state = 0, action) {\r\n  switch (action.type) {\r\n  case \'INCREMENT\':\r\n    return state + 1\r\n  case \'DECREMENT\':\r\n    return state - 1\r\n  default:\r\n    return state\r\n  }\r\n}\r\n\r\n// Create a Redux store holding the state of your app.\r\n// Its API is { subscribe, dispatch, getState }.\r\nlet store = createStore(counter)\r\n\r\n// You can use subscribe() to update the UI in response to state changes.\r\n// Normally you\'d use a view binding library (e.g. React Redux) rather than subscribe() directly.\r\n// However it can also be handy to persist the current state in the localStorage.\r\n\r\nstore.subscribe(() =>\r\n  console.log(store.getState())\r\n)\r\n\r\n// The only way to mutate the internal state is to dispatch an action.\r\n// The actions can be serialized, logged or stored and later replayed.\r\nstore.dispatch({ type: \'INCREMENT\' })\r\n// 1\r\nstore.dispatch({ type: \'INCREMENT\' })\r\n// 2\r\nstore.dispatch({ type: \'DECREMENT\' })\r\n// 1\r\n```\r\n\r\nInstead of mutating the state directly, you specify the mutations you want to happen with plain objects called *actions*. Then you write a special function called a *reducer* to decide how every action transforms the entire application\'s state.\r\n\r\nIf you\'re coming from Flux, there is a single important difference you need to understand. Redux doesn\'t have a Dispatcher or support many stores. Instead, there is just a single store with a single root reducing function. As your app grows, instead of adding stores, you split the root reducer into smaller reducers independently operating on the different parts of the state tree. This is exactly like there is just one root component in a React app, but it is composed out of many small components.\r\n\r\nThis architecture might seem like an overkill for a counter app, but the beauty of this pattern is how well it scales to large and complex apps. It also enables very powerful developer tools, because it is possible to trace every mutation to the action that caused it. You can record user sessions and reproduce them just by replaying every action.\r\n\r\n### Learn Redux from Its Creator\r\n\r\n[Getting Started with Redux](https://egghead.io/series/getting-started-with-redux) is a video course consisting of 30 videos narrated by Dan Abramov, author of Redux. It is designed to complement the \u201CBasics\u201D part of the docs while bringing additional insights about immutability, testing, Redux best practices, and using Redux with React. **This course is free and will always be.**\r\n\r\n>[\u201CGreat course on egghead.io by @dan_abramov - instead of just showing you how to use #redux, it also shows how and why redux was built!\u201D](https://twitter.com/sandrinodm/status/670548531422326785)  \r\n>Sandrino Di Mattia\r\n\r\n>[\u201CPlowing through @dan_abramov \'Getting Started with Redux\' - its amazing how much simpler concepts get with video.\u201D](https://twitter.com/chrisdhanaraj/status/670328025553219584)  \r\n>Chris Dhanaraj\r\n\r\n>[\u201CThis video series on Redux by @dan_abramov on @eggheadio is spectacular!\u201D](https://twitter.com/eddiezane/status/670333133242408960)  \r\n>Eddie Zaneski\r\n\r\n>[\u201CCome for the name hype. Stay for the rock solid fundamentals. (Thanks, and great job @dan_abramov and @eggheadio!)\u201D](https://twitter.com/danott/status/669909126554607617)  \r\n>Dan\r\n\r\n>[\u201CThis series of videos on Redux by @dan_abramov is repeatedly blowing my mind - gunna do some serious refactoring\u201D](https://twitter.com/gelatindesign/status/669658358643892224)  \r\n>Laurence Roberts\r\n\r\nSo, what are you waiting for?\r\n\r\n#### [Watch the 30 Free Videos!](https://egghead.io/series/getting-started-with-redux)\r\n\r\nIf you enjoyed my course, consider supporting Egghead by [buying a subscription](https://egghead.io/pricing). Subscribers have access to the source code for the example in every one of my videos, as well as to tons of advanced lessons on other topics, including JavaScript in depth, React, Angular, and more. Many [Egghead instructors](https://egghead.io/instructors) are also open source library authors, so buying a subscription is a nice way to thank them for the work that they\'ve done.\r\n\r\n### Documentation\r\n\r\n* [Introduction](http://redux.js.org/docs/introduction/index.html)\r\n* [Basics](http://redux.js.org/docs/basics/index.html)\r\n* [Advanced](http://redux.js.org/docs/advanced/index.html)\r\n* [Recipes](http://redux.js.org/docs/recipes/index.html)\r\n* [Troubleshooting](http://redux.js.org/docs/Troubleshooting.html)\r\n* [Glossary](http://redux.js.org/docs/Glossary.html)\r\n* [API Reference](http://redux.js.org/docs/api/index.html)\r\n\r\nFor PDF, ePub, and MOBI exports for offline reading, and instructions on how to create them, please see: [paulkogel/redux-offline-docs](https://github.com/paulkogel/redux-offline-docs).\r\n\r\n### Examples\r\n\r\n* [Counter Vanilla](http://redux.js.org/docs/introduction/Examples.html#counter-vanilla) ([source](https://github.com/reactjs/redux/tree/master/examples/counter-vanilla))\r\n* [Counter](http://redux.js.org/docs/introduction/Examples.html#counter) ([source](https://github.com/reactjs/redux/tree/master/examples/counter))\r\n* [Todos](http://redux.js.org/docs/introduction/Examples.html#todos) ([source](https://github.com/reactjs/redux/tree/master/examples/todos))\r\n* [Todos with Undo](http://redux.js.org/docs/introduction/Examples.html#todos-with-undo) ([source](https://github.com/reactjs/redux/tree/master/examples/todos-with-undo))\r\n* [TodoMVC](http://redux.js.org/docs/introduction/Examples.html#todomvc) ([source](https://github.com/reactjs/redux/tree/master/examples/todomvc))\r\n* [Shopping Cart](http://redux.js.org/docs/introduction/Examples.html#shopping-cart) ([source](https://github.com/reactjs/redux/tree/master/examples/shopping-cart))\r\n* [Tree View](http://redux.js.org/docs/introduction/Examples.html#tree-view) ([source](https://github.com/reactjs/redux/tree/master/examples/tree-view))\r\n* [Async](http://redux.js.org/docs/introduction/Examples.html#async) ([source](https://github.com/reactjs/redux/tree/master/examples/async))\r\n* [Universal](http://redux.js.org/docs/introduction/Examples.html#universal) ([source](https://github.com/reactjs/redux/tree/master/examples/universal))\r\n* [Real World](http://redux.js.org/docs/introduction/Examples.html#real-world) ([source](https://github.com/reactjs/redux/tree/master/examples/real-world))\r\n\r\nIf you\'re new to the NPM ecosystem and have troubles getting a project up and running, or aren\'t sure where to paste the gist above, check out [simplest-redux-example](https://github.com/jackielii/simplest-redux-example) that uses Redux together with React and Browserify.\r\n\r\n### Discussion\r\n\r\nJoin the [#redux](https://discord.gg/0ZcbPKXt5bZ6au5t) channel of the [Reactiflux](http://www.reactiflux.com) Discord community.\r\n\r\n### Thanks\r\n\r\n* [The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial) for a great intro to modeling state updates with reducers;\r\n* [Turning the database inside-out](http://www.confluent.io/blog/turning-the-database-inside-out-with-apache-samza/) for blowing my mind;\r\n* [Developing ClojureScript with Figwheel](https://www.youtube.com/watch?v=j-kj2qwJa_E) for convincing me that re-evaluation should \u201Cjust work\u201D;\r\n* [Webpack](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) for Hot Module Replacement;\r\n* [Flummox](https://github.com/acdlite/flummox) for teaching me to approach Flux without boilerplate or singletons;\r\n* [disto](https://github.com/threepointone/disto) for a proof of concept of hot reloadable Stores;\r\n* [NuclearJS](https://github.com/optimizely/nuclear-js) for proving this architecture can be performant;\r\n* [Om](https://github.com/omcljs/om) for popularizing the idea of a single state atom;\r\n* [Cycle](https://github.com/cyclejs/cycle-core) for showing how often a function is the best tool;\r\n* [React](https://github.com/facebook/react) for the pragmatic innovation.\r\n\r\nSpecial thanks to [Jamie Paton](http://jdpaton.github.io) for handing over the `redux` NPM package name.\r\n\r\n### Logo\r\n\r\nYou can find the official logo [on GitHub](https://github.com/reactjs/redux/tree/master/logo).\r\n\r\n### Change Log\r\n\r\nThis project adheres to [Semantic Versioning](http://semver.org/).  \r\nEvery release, along with the migration instructions, is documented on the Github [Releases](https://github.com/reactjs/redux/releases) page.\r\n\r\n### Patrons\r\n\r\nThe work on Redux was [funded by the community](https://www.patreon.com/reactdx).  \r\nMeet some of the outstanding companies that made it possible:\r\n\r\n* [Webflow](https://github.com/webflow)\r\n* [Ximedes](https://www.ximedes.com/)\r\n\r\n[See the full list of Redux patrons.](PATRONS.md)\r\n\r\n### License\r\n\r\nMIT\r\n'
    var raw = '# At Startup\r\n## 2.5D Squares\r\nTo clear, press ctrl-n\r\n\r\n## Lightbox\r\nGroups of ZTools\r\n\r\n## Drawing the model\r\nOn the top left of the view, once selected icon box will load on the right hand side tool pallete\r\nAfter selecting a ZTool, click and drag on the canvas to draw instances of the the 3D models.\r\n\r\n## Edit model\r\n+ To edit instances from the initial model from the tools, click on Edit button on the topmenu or shortcut key \"t.\"\r\n+ By default the editing tool is set to the Quick Sketch tool in Zadd mode. To take out clays from the basic model, select the Zsub button or hold on to the \"alt\" key.\r\n+ To activate symetric mode, go to the \"Transform\" menu item and click on \"activate symetric mode\" or press the shortcut key \"x.\"\r\n+ To smooth out the model, hold the \"shift\" key.\r\n+ ZIntensity can be ajusted as required to control the strokes applied to the models.\r\n+ Usual \"ctrl-z,\" and \"ctrl-shift-z\" to undo and redo. Also notice the horizontal scroll bar on the top of the viewport, you can either scroll using the middle button or drag that progress bar to go through the undo/ redo history too.\r\n\r\n## Navigating\r\n+ \"Frame\" (centre the model) using button on the shelf on the right or the \"f\" key.\r\n+ \"Shift\" key while dragging will lock on the view to the front, rear, top, bottom, left and right views.\r\n+ Perspective/ orthographic option available on the tool shelf.\r\n+ Pivit point for rotating around the view is control by the \"Local\" option inside the tool shelf.\r\n+ Move by holding onto the \"alt\" key while dragging around the open area or drag on the \"move\" shelf item.\r\n+ Scaling or zooming is done by clicking and letting go of \"alt\" while dragging in the open space or dragging on the \"scale\" shelf item.\r\n\r\n\r\n\r\n\r\n\r\n# Review of the UI\r\n## Shelves, palletss\r\n+ Collapsable shelves, left, right and bottom\r\n+ Collapse all shelves by pressing the \"tab\" key.\r\n+ Close by clicking on the top-right circle on the pallet.\r\n\r\n## Right shelf\r\nClicking while holding onto the \"alt\" key to add to the right shelf.\r\n\r\n## Customise Location\r\n+ Customise locations can be enabled by \"Preferences\" => \"Config\" => \"Enable Customize.\"\r\n+ Dock pallets by dragging into shelves.\r\n\r\n## Customise menus and buttons\r\n+ Customised buttons using \"ctrl-alt\" to any area highlighted with white outlines\r\n+ Remove customised buttons, using \"ctrl-alt\" and drag into the main document area.\r\n+ Customised menu by doing;\r\n  1. Enable custmoised ui\r\n  2. \"Preferences\" => \"Customise UI\" => \"Create new menu\"\r\n\r\n## Saving interface configuration\r\n+ Save/ Load current UI, \"Preferences\" => \"Config\"\r\n\r\n## Colours\r\n+ Change UI colour presets by clicking onto the arrows on the windows bar.\r\n  Store configuration from \"Preferences\" => \"Config\" to save the colour preset.\r\n+ More fine fine-grained colour configuration can be done through \"Preferences\" => \"IColors\"\r\n\r\n\r\n\r\n\r\n\r\n# Initialise ZBrush\r\n## Restore factory settings\r\nTo restore to default settings, go \"Preferences\" => \"Init ZBrush.\"\r\nSave presets and customise UIs that you would like to keep.\r\n\r\n\r\n\r\n\r\n\r\n# Saving\r\n## Tool files - ztl files\r\n+ Tools activated using Lightbox/ shortcut \"comma key\"\r\n+ Load/ Save as\r\n+ Import/ Export - ojb, maya, etc.\r\n\r\n## Image/ 2.5D\r\n+ Scenes, Save/ Save as, zbr files\r\n+ Images, Import/ export\r\n\r\n## Project files - zpr\r\n+ File pallete => Save/ Load button, revert, option to save undo\r\n\r\n\r\n\r\n\r\n\r\n# Brush adjustments\r\n\r\nZAdd/ ZSub\r\nAlt to temporary to switch to the opposite mode\r\nIntensity, \"u\"\r\nDraw size, \"s\"\r\nFocal shift, \"o\"\r\nRGB = colour, M = Material, MRGB = Material and color\r\nRGB Intensity, \"i\"\r\nThese settings are local to the tools\r\n\r\n\r\n\r\n\r\n\r\n# Strokes and alphas\r\nBrushes has default strokes and alphas\r\nStandard - dot strokes\r\nClay buildup - freehand stroke, brushalpha\r\nLightbox => Alpha for extra choices of alphas\r\nDouble click to activate alphas.\r\n\r\n\r\n\r\n\r\n\r\n# Masking\r\n## Painting a mask\r\nPaint a mask by painting while holding the \"ctrl\" key. The mask will appear as a dark area on the model.\r\n\r\n## Inverse the mask\r\nInverse the mask by holding \"ctrl\" and click on the open area.\r\n\r\n## Subtract from the mask\r\nHold \"ctrl + alt\" and paint to subtract from the mask.\r\n\r\n## Brush strokes and alpha\r\n+ You can apply brush strokes and alphas to both and paint tool and the masking took.\r\n+ Remember to hold down \"ctrl\" key if you are applying the stroke to the mask tool.\r\n+ Example: A fun case to try is DragRect for brush stroke and Alpha 62 for alpha.\r\n\r\n## Mask by applying alpha as if applying a sheet to the surface\r\nWhile holding \"ctrl,\" click and drag from the open area to where the mask is applied.\r\n\r\n## Finer grain \r\n+ To blur a mask, hold down \"ctrl\" and click on the mask\r\n+ To Sharpen the mask, hold down \"ctrl + alt\" and click.\r\n+ \"Mask By Smoothness,\" \"Mask By Color,\" etc.\r\n\r\n\r\n\r\n\r\n\r\n# 2.5D\r\n+ In and out edit mode, last drawn tool is the active tool\r\n+ So once one 2.5 object is being drawn and no longer the active tool it cannot be modified.\r\n+ Insert mesh brush, use geometries as cutting tool\r\n+ Polymode, subtraction\r\n\r\n\r\n\r\n\r\n\r\n# Dynamesh\r\nAutomatically remeshed, unlimitted pulling\r\nCombining, separating into multiple pieces\r\n\r\n\r\n\r\n\r\n\r\n\r\n# Help\r\nHold down \"ctrl\" while having the mouse over the elements\r\nAccess the online documentation\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n# Mask\r\nPaint a mask, inverse a mask, clear a mask\r\n\r\n\r\n\r\n\r\n# ZSphere\r\n+ Locate drom the tool pallette, \"two toned red ball\"\r\n+ Orientations: Darker faces the normal and should be what faces the user too, the line is the x axis\r\n+ Preview: \'A\' key\r\n+ Brush size: \'S\' key\r\n+ Basic controls: QWER, draw, move, scale, rotate\r\n+ Adding:\r\n  - Shift locks to parent size, ctrl locks to draw size\r\n  - Adding to connections, Shift + A to enter sketch mode which enables that\r\n+ Moving: \r\n  - Dragging moves the node\r\n  - Alt dragging moves the chain\r\nOn grey link-sphere moves chain\r\n+ Scaling: Alt drag scale the chain\r\n+ Rotate: Alt to rotate chain\r\n\r\n# Reference image - grid\r\n+ Load tool/ model\r\n+ Turn on Floor, on the right of toolbox\r\n+ Draw palette => Front back => Map1 => Import\r\n'
    var jsonMl = markdown.parse(raw, 'Maruku')
    prepareContentForViews(jsonMl)
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
    console.log(JsonML.toHTMLText(jsonMl))
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
