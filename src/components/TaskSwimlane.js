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
      </div>
    )
  }
}

TaskSwimlane.PropTypes = {
  key: PropTypes.string.isRequired
}

export default TaskSwimlane
