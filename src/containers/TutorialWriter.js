import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Toc from 'components/Toc'
import Timeline from 'containers/Timeline'
import MainViewport from 'containers/MainViewport'
import Editor from 'containers/Editor'

import { selectionSelect } from 'actions/tutorialWriterActions'

import 'sass/components/tutorial-writer.scss'

function mapStateToProps (state) {
  return {
    file: state.tutorialWriter.file,
    rawContent: state.tutorialWriter.rawContent,
    layout: state.tutorialWriter.layout
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectionSelect: () => {
      dispatch(selectionSelect())
    }
  }
}

class TutorialWriter extends Component {
  render () {
    return (
      <div className={'TutorialWriter'}>
        <Toc jsonMlRaw={this.props.rawContent.jsonMlRaw} selectionSelect={this.props.selectionSelect} />
        <div className={'TutorialWriter-Content'}>
          <Timeline />
          <MainViewport html={this.props.rawContent.html} jsonMlRaw={this.props.rawContent.jsonMlRaw} layout={this.props.layout} />
        </div>
        <Editor />
      </div>
    )
  }
}

TutorialWriter.propTypes = {
  file: PropTypes.string.isRequired,

  rawContent: PropTypes.shape({
    text: PropTypes.string.isRequired,
    jsonMlRaw: PropTypes.array.isRequired,
    html: PropTypes.string.isRequired
  }).isRequired,

  layout: PropTypes.shape({
    paperWidth: PropTypes.number.isRequired,
    paperHeight: PropTypes.number.isRequired,
    pages: PropTypes.arrayOf(
      PropTypes.shape({
        columns: PropTypes.arrayOf(
          PropTypes.shape({
            height: PropTypes.number.isRequired,
            heightByLines: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired
          }).isRequired
        ).isRequired
      }).isRequired
    ).isRequired
  }).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorialWriter)
