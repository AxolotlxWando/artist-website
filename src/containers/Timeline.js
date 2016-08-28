import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import Paragraph from 'components/Paragraph'
import TaskSwimlane from 'components/TaskSwimlane'
import CharacterSwimlane from 'components/CharacterSwimlane'

import 'sass/components/timeline.scss'

function mapStateToProps (state) {
  return {
    text: state.tutorialWriter.text,
    json: state.tutorialWriter.json,
    html: state.tutorialWriter.html
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

class Timeline extends Component {
  render () {
    return (
      <div className={'Timeline'}>
        <Paragraph />
        <TaskSwimlane />
        <CharacterSwimlane />
        <div dangerouslySetInnerHTML={{__html: this.props.json}} />
      </div>
    )
  }
}
/*
Timeline.propTypes = {
  taskSwimlanes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired
    })
  ),
  isDragging: PropTypes.func.bool
}*/

export default connect(mapStateToProps)(Timeline)
