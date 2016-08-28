import React, { Component } from 'react'
import { connect } from 'react-redux'

import Toc from 'components/Toc'
import Timeline from 'containers/Timeline'
import MainViewport from 'containers/MainViewport'
import Editor from 'containers/Editor'

import { selectionAdd } from 'actions/tutorialWriterActions'

import 'sass/components/tutorial-writer.scss'

function mapStateToProps (state) {
  return {
    text: state.tutorialWriter.text,
    json: state.tutorialWriter.json,
    html: state.tutorialWriter.html
  }
}

function mapDispatchToProps (dispatch) {
  return {
    selectionAdd: () => {
      dispatch(selectionAdd())
    }
  }
}

class TutorialWriter extends Component {
  render () {
    return (
      <div className={'TutorialWriter'}>
        <Toc />
        <div className={'TutorialWriter-Content'}>
          <Timeline />
          <MainViewport html={this.props.html} />
        </div>
        <Editor />
      </div>
    )
  }
}

TutorialWriter.propTypes = {
}

export default connect(mapStateToProps, mapDispatchToProps)(TutorialWriter)
