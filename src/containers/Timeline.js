import React, { Component, PropTypes } from 'react'

import TaskSwimlane from 'components/TaskSwimlane'
import CharacterSwimlane from 'components/CharacterSwimlane'

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
      <div style={{
        width: '150px',
        height: '150px',
        border: '2px solid #000',
        'overflow-x': 'scroll',
        'overflow-y': 'scroll'
      }}>
        <svg style={{
          width: '150px',
          height: '150px',
          viewBox: '0, 0, 150, 150',
          x: '0',
          y: '0'
        }}>
          <TaskSwimlane />
          <CharacterSwimlane />
        </svg>
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
