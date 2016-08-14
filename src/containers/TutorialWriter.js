import React, { Component, PropTypes } from 'react'

import Timeline from 'containers/Timeline'
import MainViewport from 'containers/MainViewport'

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
      <div>
        Tutorial writer
        <Timeline />
        <MainViewport />
      </div>
    )
  }
}

TutorialWriter.PropTypes = {
  taskSwimlanes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired
    })
  ).isRequired
}

export default TutorialWriter
