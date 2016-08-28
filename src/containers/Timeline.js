import React, { Component, PropTypes } from 'react'

import TaskSwimlane from 'components/TaskSwimlane'
import CharacterSwimlane from 'components/CharacterSwimlane'

import 'sass/components/timeline.scss'

class Timeline extends Component {
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
      <div className={'Timeline'}>
        <TaskSwimlane />
        <CharacterSwimlane />
        <ul>
          <li>blah 1</li>
          <li>blah 2</li>
          <li>blah blah blah blah</li>
        </ul>
      </div>
    )
  }
}

Timeline.PropTypes = {
  taskSwimlanes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired
    })
  ),
  isDragging: PropTypes.func.bool
}

export default Timeline
