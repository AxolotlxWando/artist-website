import React, { Component } from 'react'
import { connect } from 'react-redux'

import Toc from 'components/Toc'
import Timeline from 'containers/Timeline'
import MainViewport from 'containers/MainViewport'
import Editor from 'containers/Editor'

import { selectionAdd } from 'actions/tutorialWriterActions'

function mapStateToProps (state) {
  return {
    text: state.text,
    json: state.json,
    html: state.html
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
  getStyleString () {
    return (
      'height: 200px;' +
      'width: 200px;' +
      'border: 2px solid #000;' +
      'overflow-x: scroll;'
    )
  }
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
