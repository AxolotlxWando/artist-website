import React, { Component, PropTypes } from 'react'

import Timeline from 'components/Timeline'
import MainViewport from 'components/MainViewport'

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
  ),
  isDragging: PropTypes.func.bool
}

export default TutorialWriter
