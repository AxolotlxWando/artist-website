import React, { Component, PropTypes } from 'react'

import Paper from 'material-ui/Paper'

import 'github-markdown-css/github-markdown.css'
import 'sass/components/main-viewport.scss'
import 'assets/wood_textures/wood1.jpg'
import 'assets/wood_textures/wood2.jpg'
import 'assets/wood_textures/wood3.jpg'
import 'assets/wood_textures/wood4.jpg'
import 'assets/wood_textures/wood5.jpg'
import 'assets/wood_textures/wood6.jpg'
import 'assets/wood_textures/wood7.jpg'
import 'assets/wood_textures/wood8.jpg'
import 'assets/wood_textures/wood9.jpg'

class MainViewport extends Component {
  render () {
    const onMouseDownHandler = (e) => {
      console.log('onMouseDown()')
      console.log('e.button = ' + e.button)
    }
    const onDragHandler = (e) => {
      console.log('onClick()')
      console.log('e.button = ' + e.button)
      console.log('e.buttons = ' + e.buttons)
    }

    const paperStyle = {
      height: this.props.layout.paperHeight + 'rem',
      width: this.props.layout.paperWidth + 'rem',
      margin: 5.5 / 3 * 2 * 2.362204724 / 1.414213562 + 'rem' + ' ' + 5.5 / 3 * 2 * 2.362204724 + 'rem',    // 5.5 cm is default columns' width, this is 2/3 of that
      display: 'inline-block',

      fontSize: 0.5625 + 'rem'
    }

    return (
      <div
        id='mainViewport'
        className={'MainViewport'}
        onMouseDown={onMouseDownHandler}
        onDrag={onDragHandler}
      >
        <Paper style={paperStyle} zDepth={3}>
          <div className={'markdown-body'}>
            <div dangerouslySetInnerHTML={{__html: this.props.html}} />
          </div>
        </Paper>
      </div>
    )
  }
}

MainViewport.propTypes = {
  html: PropTypes.string.isRequired,
  jsonMlRaw: PropTypes.array.isRequired,

  layout: PropTypes.shape({
    paperHeight: PropTypes.number.isRequired,
    paperWidth: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        height: PropTypes.number.isRequired,
        heightByLines: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired
      })
    ).isRequred
  }).isRequired
}

export default MainViewport
