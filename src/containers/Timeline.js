import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import Paragraph from 'components/Paragraph'
import ParagraphButtonAdd from 'components/ParagraphButtonAdd'
import TaskSwimlane from 'components/TaskSwimlane'
import CharacterSwimlane from 'components/CharacterSwimlane'

import 'sass/components/timeline.scss'

function mapStateToProps (state) {
  return {
    text: state.tutorialWriter.text,
    jsonMl: state.tutorialWriter.jsonMl,
    html: state.tutorialWriter.html
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

class Timeline extends Component {
  render () {
    const headings = JSON.stringify(this.props.jsonMl)

    return (
      <div className={'Timeline'}>
        <Paragraph />
        <ParagraphButtonAdd />
        <TaskSwimlane />
        <CharacterSwimlane />
        <div style={{display: 'none'}} dangerouslySetInnerHTML={{__html: headings}} />
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
