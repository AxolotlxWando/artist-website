// React & Redux
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

// JsonMl utils
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

// Artist Website - Actions
import {
  viewPointerSeek,
  highlightPointerSeek,
  activePointerSeek
} from 'actions/pointersActions'
import {
  loadEmotes,
  loadConversations
} from 'actions/editorActions'

// Artist Website - Utils
import { isBlockElement, isLeafElement } from 'utils/element-types'

// Styles and Assets
import 'sass/components/timeline.scss'
import 'assets/timeline-background.png'
// import 'assets/timeline-item.png'

function mapStateToProps (state) {
  return {
    viewPosition: state.tutorialWriter.pointers.activePosition,
    highlightPosition: state.tutorialWriter.pointers.highlightPosition,
    activePosition: state.tutorialWriter.pointers.activePosition
  }
}

function mapDispatchToProps (dispatch) {
  return {
    viewPointerSeek: (position) => {
      dispatch(viewPointerSeek(position))
    },
    highlightPointerSeek: (position) => {
      dispatch(highlightPointerSeek(position))
    },
    activePointerSeek: (position) => {
      dispatch(activePointerSeek(position))
    },
    loadEmotes: () => {
      dispatch(loadEmotes())
    },
    loadConversations: () => {
      dispatch(loadConversations())
    }
  }
}

function processSection (jsonMl, activePosition) {
  // return [
  //   ['div', {elPosition: 0, elHeight: 2}],
  //   ['textNode', {elPosition: 4, elHeight: 4}],
  //   ['header', {elPosition: 31, elHeight: 5}],
  //   ['div', {elPosition: 31, elHeight: 9}],
  //   ['img', {elPosition: 31, elHeight: 3}]
  // ]

  if (typeof jsonMl === 'undefined') {
    return []
  }

  var section = []
  function addNodes (node, array) {
    // console.log('timeline(): node.length = ' + node.length)
    for (let i = 0; i < node.length; i++) {
      var curr = node[i]
      // console.log('curr = ' + JsonML.isElement(curr) ? curr[0] : curr)
      // console.log('JsonML.isElement(curr) = ' + JsonML.isElement(curr))
      // console.log('isBlockElement(JsonML.getTagName(curr)) = ' + isBlockElement(curr))
      // console.log('JsonML.getTagName(curr) === \'textNode \'' + JsonML.getTagName(curr) === 'textNode')
      if (
        JsonML.isElement(curr) &&
        isBlockElement(curr) ||
        JsonML.getTagName(curr) === 'textNode'
      ) {
        array.push(
          [JsonML.getTagName(curr), JsonML.getAttributes(curr)]
        )
        if (isBlockElement(curr) && !isLeafElement(curr)) {
          addNodes(curr, array)
        }
      }
    }
  }

  addNodes(jsonMl, section)
  // console.log('timeline(): section = ' + section)
  return section
}

class TimelineElement extends Component {
  constructor (props) {
    super(props)
    this.onClickEmotes = this.onClickEmotes.bind(this)
    this.onClickConversations = this.onClickConversations.bind(this)
  }
  onClickEmotes () {
    console.log('TimelineElmeent:onClickEmotes()')
    this.props.loadEmotes()
  }
  onClickConversations () {
    console.log('TimelineElmeent:onClickConversations()')
    this.props.loadConversations()
  }
  shouldComponentUpdate (nextProps) {
    return true
    return (
      this.props.elStart <= this.props.highlightPosition &&
      this.props.highlightPosition < this.props.elEnd
    ) || (
      this.props.elStart <= nextProps.highlightPosition &&
      nextProps.highlightPosition < this.props.elEnd
    )
  }
  render () {
    // console.log(
    //   'elStart, elEnd, props.highlightPosition = ' +
    //   this.props.elStart + ', ' +
    //   this.props.elEnd + ', ' +
    //   this.props.highlightPosition
    // )
    var height = typeof this.props.elHeight !== 'undefined' ? this.props.elHeight : 3
    var style = {
      width: Math.round(height) * 20 - 2 - 6 + 'px'
      // width: 3 * 20 - 2 - 6 + 'px'
    }
    return (
      <div
        className={
          classNames(
            'TimelineElement',
            {isHighlighted:
              this.props.elStart <= this.props.highlightPosition &&
              this.props.highlightPosition < this.props.elEnd
            }
          )
        }
        style={style}
      >
        <div className={'TimelineElementTitle'}>{this.props.title}</div>
        <div className={'TimelineElementWordBox'} onClick={this.onClickEmotes} />
        <div className={'TimelineElementWordBoxFill'} onClick={this.onClickEmotes} />
        <div className={'TimelineElementCharacterBox'} onClick={this.onClickConversations} />
        <div className={'TimelineElementCharacterBoxFill'} onClick={this.onClickConversations} />
      </div>
        // <div className={
        //   classNames(
        //     {TimelineElementOverlay:
        //       this.props.elStart <= this.props.highlightPosition &&
        //       this.props.highlightPosition < this.props.elEnd
        //     }
        //   )
        // } />
    )
  }
}

TimelineElement.propTypes = {
  // taskSwimlanes: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     key: PropTypes.number.isRequired,
  //     image: PropTypes.string.isRequired
  //   })
  // ),
  // isDragging: PropTypes.func.bool
  title: PropTypes.string.isRequired,
  elStart: PropTypes.number.isRequired,
  elEnd: PropTypes.number.isRequired,
  highlightPosition: PropTypes.number.isRequired
}

class Timeline extends Component {
  shouldComponentUpdate (nextProps) {
    return true
    // return nextProps.jsonMl !== this.props.jsonMl
  }
  render () {
    var section = processSection(this.props.jsonMl, this.props.activePosition)
    return (
      <div className={'Timeline'}>
        <div className={'TimelineHeader'} />
        <div className={'TimelineBody'}>
          {section.map((element, index) => {
            // console.log('elPosition = ' + JsonML.getAttribute(element, 'elPosition'))
            // console.log('elHeight = ' + JsonML.getAttribute(element, 'elHeight'))
            // console.log('')
            // console.log('')
            return (
              <TimelineElement key={index}
                title={JsonML.getTagName(element)}
                elStart={JsonML.getAttribute(element, 'elPosition')}
                elEnd={JsonML.getAttribute(element, 'elPosition') + JsonML.getAttribute(element, 'elHeight')}
                elHeight={JsonML.getAttribute(element, 'elHeight')}
                highlightPosition={this.props.highlightPosition}

                loadEmotes={this.props.loadEmotes}
                loadConversations={this.props.loadConversations}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

Timeline.propTypes = {
  // taskSwimlanes: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     key: PropTypes.number.isRequired,
  //     image: PropTypes.string.isRequired
  //   })
  // ),
  // isDragging: PropTypes.func.bool
  jsonMl: PropTypes.array.isRequired,
  viewPosition: PropTypes.number.isRequired,
  highlightPosition: PropTypes.number.isRequired,
  activePosition: PropTypes.number.isRequired,

  loadEmotes: PropTypes.func.isRequired,
  loadConversations: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline)
