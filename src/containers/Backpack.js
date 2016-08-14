import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import SvgIcon from 'material-ui/SvgIcon'
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionWork from 'material-ui/svg-icons/action/work'

import TaskSwimlane from 'components/TaskSwimlane'
import CharacterSwimlane from 'components/CharacterSwimlane'

function mapStateToProps (state) {
  return {
    collapsed: state.backpack.collapsed
  }
}

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
        <FloatingActionButton style={{position: 'absolute', right: 20, bottom: 20}}>
          <ActionWork />
        </FloatingActionButton>
        <TaskSwimlane />
        <CharacterSwimlane />
        <ul>
          <li>blah 1</li>
          <li>blah 2</li>
          <li>blah blah blah blah</li>
        </ul>
        <div>Icons made by <a href='http://www.flaticon.com/authors/epiccoders' title='EpicCoders'>EpicCoders</a> from <a href='http://www.flaticon.com' title='Flaticon'>www.flaticon.com</a> is licensed by <a href='http://creativecommons.org/licenses/by/3.0/' title='Creative Commons BY 3.0' target='_blank'>CC 3.0 BY</a></div>
      </div>
    )
  }
}

Backpack.PropTypes = {
  collapsed: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(Backpack)
