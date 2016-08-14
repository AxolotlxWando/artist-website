import React, { Component, PropTypes } from 'react'
import Task from 'components/Task'

class TaskSwimlane extends Component {
  render () {
    return (
      <div>
        <div>
          TaskSwimlane Header
        </div>
        <Task key={"start"} />
        <Task key={"end"} />
        <div style={{
          width: '150px',
          height: '150px',
          border: '2px solid #000',
          overflowX: 'scroll',
          overflowY: 'scroll'
        }}>
          <svg style={{
            width: '150px',
            height: '150px',
            viewBox: '0, 0, 150, 150',
            x: '0',
            y: '0'
          }}>
          </svg>
        </div>
      </div>
    )
  }
}

TaskSwimlane.PropTypes = {
  key: PropTypes.string.isRequired
}

export default TaskSwimlane
