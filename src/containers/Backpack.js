import React, { Component, PropTypes } from 'react'

import TaskSwimlane from 'components/TaskSwimlane'
import CharacterSwimlane from 'components/CharacterSwimlane'

class Backpack extends Component {
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

Backpack.PropTypes = {
  Collapsed: PropTypes.bool.isRequired
}

export default Backpack
