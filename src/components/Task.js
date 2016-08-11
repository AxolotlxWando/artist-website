import { Component } from 'react'

class Task extends Component {
  render () {
    return (
      <div>
        Task {this.props.id}
      </div>
    )
  }
}

export default Task
