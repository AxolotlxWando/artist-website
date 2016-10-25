// React
import React, { Component, PropTypes } from 'react'

// JsonMl utils
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

// Utils
import {isText, isInlineElement, isBlockElement} from 'utils/element-types'
// const inlineElements = ['link', 'em', 'strong', 'inlinecode', 'linebreak']
// const blockElements = ['header', 'para', 'img', 'bulletlist', 'numberlist', 'listitem', 'code_block']
import { getChildren } from 'utils/getChildren'

const hardfix = 1.35

class ContentNode extends Component {
  constructor (props) {
    super(props)
    this.handleHoverOn = this.handleHoverOn.bind(this)
    this.handleHoverOff = this.handleHoverOff.bind(this)
    this.state = {
      nodeJsonMl: this.props.node,
      cachedNode: 'undefined'
    }
  }
  handleHoverOn () {
    var node = this.state.nodeJsonMl
    if (
      typeof node !== 'undefined' &&
      JsonML.isElement(node) &&
      typeof JsonML.getAttribute(node, 'elPosition') !== 'undefined'
    ) {
      var nodePosition = JsonML.getAttribute(node, 'elPosition')
      var curr
      var nextNode
      // console.log('flattened = ')
      // console.log((this.props.flattenedJsonMl))
      for (let i = 0; i < this.props.flattenedJsonMl.length; i++) {
        curr = this.props.flattenedJsonMl[i]
        var elStart = JsonML.getAttribute(curr, 'elPosition')
        var elEnd = elStart + JsonML.getAttribute(curr, 'elHeight')
        // console.log('handleHoverOn(): elStart = ' + elStart + ', ' + 'elEnd' + elEnd)
        // console.log('handleHoverOn(): nodePosition = ' + nodePosition)
        if (
          elStart <= nodePosition &&
          nodePosition < elEnd
        ) {
          nextNode = curr
          console.log('handleHoverOn(): matched found = ' + curr[0])
        }
      }
      if (typeof nextNode !== 'undefined') {
        console.log('handleHoverOn(): nextNode = ' + nextNode[0])
      }
      if (typeof this.cachenode != 'undefined'){
        console.log('handleHoverOn(): this.cacheNode = ' + this.cachedNode[0])
      }
      if (nextNode != this.state.cachedNod) {
        this.state.cachedNod = nextNode
        this.props.highlightPointerSeek(nodePosition)
        console.log('handleHoverOn(): moving in position ' + nodePosition)
      }
    }
    console.log('handleHoverOn(): nodePosition = ' + nodePosition + ', this.cachedNode = ' + this.cachedNode + ', nextNode = ' + nextNode)
  }
  handleHoverOff () {
    if (
      typeof this.state.nodeJsonMl !== 'undefined' &&
      JsonML.isElement(this.state.nodeJsonMl) &&
      JsonML.getAttribute(this.state.nodeJsonMl, 'elPosition') === this.props.highlightPosition
    ) {
      this.props.highlightPointerSeek(-1)
      console.log('moving in position ' + JsonML.getAttribute(this.state.nodeJsonMl, 'elPosition'))
    }
  }
  componentDidMount () {
    if (this.props.compileFlag) {
      if (
        typeof this.state.nodeJsonMl !== 'undefined' &&
        JsonML.isElement(this.state.nodeJsonMl) &&
        JsonML.getAttribute(this.state.nodeJsonMl, 'elHeight') !== 'undefined'
      ) {
        JsonML.setAttribute(this.state.nodeJsonMl, 'elHeight', this._domRef.clientHeight)
        this._domRef._jsonMl = this.state.nodeJsonMl
      }
      var node = this.props.node
      console.log(this.props.updateResultJsonMl)
      if (isBlockElement(node) || JsonML.getTagName(node) === 'markdown') {
        this.props.updateResultJsonMl(this.state.nodeJsonMl)
      }
    }
  }
  render () {
    var start = this.props.start
    var end = this.props.end
    if (this.props.compile) {
      start = 0
      end = 9999
    }
    var node = this.props.node
    // console.log('ContentNode: ' + node)
    if (typeof node === undefined || node.length <= 0) {
      // console.log('ContentNode: node undefined')
      return (
        <div> ContentNode: node undefined </div>
      )
    }

    // console.log(JsonML.toHTML(node))
    var attributes = JsonML.getAttributes(node)
    if (typeof attributes !== 'undefined') {
      var position = attributes.elPosition
      var height = attributes.elHeight
    } else {
      // console.log('ContenNode: Error, cannot retrieve attributes from node: ' + node)
    }

    if (JsonML.getTagName(node) === 'textNode') {
      // console.log('ContentNode-textNode: ')
      // console.log(node)
      // console.log('')
      var source = JsonML.toHTMLText(node)
      source = source.replace(/<textnode [^>]*>(.*?)<\/textnode>/, function (m, p1) { return p1 })

      var contentNodeStyle = {}
      console.log()
      if (parseInt(JsonML.getAttribute(node, 'elPosition')) * hardfix < start || // true ||
          parseInt(JsonML.getAttribute(node, 'elPosition')) * hardfix > end) {
        contentNodeStyle.display = 'none'
        return null
      }
      return (
        <div
          ref={(c) => { this._domRef = c }}
          onMouseEnter={this.handleHoverOn}
          onMouseLeave={this.handleHoverOff}
          className={'textNode'}
          style={contentNodeStyle}
        >
          <div dangerouslySetInnerHTML={{__html: source}} />
        </div>
      )
    } else if (isText(node) || isInlineElement(node)) {
      // console.log('Content is uncompiled or corrupted: ' + node + '||' + JsonML.getTagName(node))
      return (
        <div>Content is uncompiled or corrupted: {node + '||' + JsonML.getTagName(node)}</div>
      )
    } else if (isBlockElement(node) || JsonML.getTagName(node) === 'markdown') {
      var tag = JsonML.getTagName(node)

      if (tag === 'header') {
        tag = 'h' + JsonML.getAttribute(node, 'level')
      }
      if (tag === 'markdown') {
        tag = 'div'
      }
      var BlockElement = tag
      var blockStyle = {}
      if (parseInt(JsonML.getAttribute(node, 'elPosition')) * hardfix < start || // true ||
          parseInt(JsonML.getAttribute(node, 'elPosition')) * hardfix > end) {
        blockStyle.display = 'none'
        return null
      }
      // console.log(
      //   'start, end, elPosition, hardfix elPosition = ' +
      //   start + ', ' +
      //   end + ', ' +
      //   parseInt(JsonML.getAttribute(node, 'elPosition')) + ', ' +
      //   parseInt(JsonML.getAttribute(node, 'elPosition')) * hardfix
      // )

      return (
          // {JsonML.getTagName(node) + ' {position: ' + position + ', height: ' + height}
          // console.log('ContentNode-blockElement: child element')
          // console.log(result)
        <BlockElement
          ref={(c) => { this._domRef = c }}
          onMouseEnter={this.handleHoverOn}
          onMouseLeave={this.handleHoverOff}
          className={'blockElement'}
          style={blockStyle}
        >
          {getChildren(node).map((result, index) => {
            return (
              <ContentNode
                flattenedJsonMl={this.props.flattenedJsonMl}
                updateResultJsonMl={this.props.updateResultJsonMl}

                // viewPosition={this.props.viewPosition}
                highlightPosition={this.props.highlightPosition}
                activePosition={this.props.activePosition}
                viewPointerSeek={this.props.viewPointerSeek}
                highlightPointerSeek={this.props.highlightPointerSeek}

                compileFlag={this.props.compileFlag}
                key={result[0] + index}
                node={result}
                start={start}
                end={end}
              />
            )
          })}
        </BlockElement>
      )
      // console.log('')
    } else {
      return (
        <div>Content is corrupted, unknown content node: {JsonML.getTagName(node)}</div>
      )
      // console.log('ContentNode-unknown tag')
      // console.log('')
    }
  }
}

ContentNode.contextTypes = {
  currPosition: React.PropTypes.number
}

ContentNode.propTypes = {
  flattenedJsonMl: PropTypes.array.isRequired,

  node: PropTypes.array.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  updateResultJsonMl: PropTypes.func.isRequired,

  // viewPosition: PropTypes.number.isRequired,
  highlightPosition: PropTypes.number.isRequired,
  activePosition: PropTypes.number.isRequired,

  viewPointerSeek: PropTypes.func.isRequired,
  highlightPointerSeek: PropTypes.func.isRequired
}

export default ContentNode
