// React
import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

// Redux
import { connect } from 'react-redux'
import { toggleEditor } from 'actions/editorActions'

// Material UI
import RaisedButton from 'material-ui/RaisedButton';

// JsonMl utils
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

// Styles and Assets
import 'sass/components/editor.scss'
import 'assets/editor-header.png'

function mapStateToProps (state) {
  return {
    collapsed: state.tutorialWriter.editor.collapsed,
    mode: state.tutorialWriter.editor.mode,
    activePosition: state.tutorialWriter.pointers.activePosition
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleEditor: () => {
      dispatch(toggleEditor())
    }
  }
}

class Editor extends Component {
  constructor () {
    super()
    this.handleOnClick = this.handleOnClick.bind(this)
  }
  handleOnClick () {
    this.props.toggleEditor()
  }
  render () {
    var EditorContent
    switch (this.props.mode) {
      case 'content':
        var activeNode
        var curr
        for (let i = 0; i < this.props.flattenedJsonMl.length; i++) {
          curr = this.props.flattenedJsonMl[i]
          var elStart = JsonML.getAttribute(curr, 'elPosition')
          var elEnd = elStart + JsonML.getAttribute(curr, 'elHeight')
          // console.log('handleHoverOn(): elStart = ' + elStart + ', ' + 'elEnd' + elEnd)
          // console.log('handleHoverOn(): this.props.activePosition = ' + this.props.activePosition)
          if (
            elStart <= this.props.activePosition &&
            this.props.activePosition < elEnd
          ) {
            activeNode = curr
            console.log('handleHoverOn(): matched found = ' + curr[0])
          }
        }
        if (typeof activeNode !== 'undefined') {
          EditorContent = (
            <textarea name="contentNode" value={curr} />
          )
        } else {
          EditorContent = (
            <div>{'<< Empty Node >>'}</div>
          )
        }
        break
      case 'emotes':
        EditorContent = (
          <div>{'<< Editing character emotes >>'}</div>
        )
        break
      case 'conversations':
        EditorContent = (
          <div>{'<< Editing character conventions >>'}</div>
        )
        break
      default:
        EditorContent = (
          <div>{'<< Select heading or paragraphs from viewport to edit, select keyframes in timeline to edit conversations and emotes >>'}</div>
        )
    }

    return (
      <div className={
        classNames(
          'EditorContainer',
          {isCollapsed: this.props.collapsed}
        )
      }>
        <div className={'EditorHeader'} onClick={this.handleOnClick} />
        <div className={
          classNames(
            'Editor',
            {isCollapsed: this.props.collapsed}
          )
        }>
          <div className={'EditorContent'}>
            {EditorContent}
          </div>
          <div className={'EditorButtons'}>
            <RaisedButton label="Cancel" style={{fontSize: '0.75em', height: '20px', width: '50%'}}/>
            <RaisedButton label="Apply" primary={true} style={{fontSize: '0.75em', height: '20px', width: '50%'}}/>
          </div>
        </div>
      </div>
    )
  }
}

Editor.propTypes = {
  collapsed: PropTypes.bool.isRequired,

  flattenedJsonMl: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  activePosition: PropTypes.number.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
