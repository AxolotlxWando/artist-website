// React
import React, { Component, PropTypes } from 'react'

// Material UI
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'

// JsonMl utils
import JsonMLUtils from 'jsonml-tools/jsonml-utils'
import JsonMLHTML from 'jsonml-tools/jsonml-html'
const JsonML = Object.assign({}, JsonMLUtils, JsonMLHTML)

// Artist Website
import ContentNode from 'components/ContentNode'

// Styles
import 'github-markdown-css/github-markdown.css'
import 'sass/components/main-viewport.scss'

// Assets
import 'assets/wood_textures/wood1.jpg'
import 'assets/wood_textures/wood2.jpg'
import 'assets/wood_textures/wood3.jpg'
import 'assets/wood_textures/wood4.jpg'
import 'assets/wood_textures/wood5.jpg'
import 'assets/wood_textures/wood5-gs.jpg'
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

    console.log('this.props.layout = ' + this.props.layout)
    console.log('this.props.module.jsonMl = ' + this.props.module.jsonMl)

    var bodyComponent
    if (typeof this.props.layout !== 'undefined' && typeof this.props.module.jsonMl !== 'undefined') {
      const paperStyle = {
        display: 'inline-block',
        height: this.props.layout.paperHeight + 'rem',
        width: this.props.layout.paperWidth + 'rem',
        margin: 5.5 / 3 * 2 / 4.181818182 + 'rem' + ' ' + 5.5 / 3 * 2 / 4.181818182 + 'rem',
        // display: 'inline-block',

        fontSize: 0.5625 + 'rem'
      }
      var bodyHtml = JsonML.toHTML(this.props.module.jsonMl)
      bodyComponent = (
        <Paper style={paperStyle} zDepth={3}>
          <div className={'markdown-body'}>
            <div dangerouslySetInnerHTML={{__html: bodyHtml}} />
            <ContentNode node={this.props.module.jsonMl} />
          </div>
        </Paper>
      )
      console.log('MainViewport: layout, module.jsonMl')
    } else {
      bodyComponent = () => {
        return (
          <div>
            Loading content... <br />
            <CircularProgress />
          </div>
        )
      }
    }
    return (
      <div
        className={'MainViewport'}
        onMouseDown={onMouseDownHandler}
        onDrag={onDragHandler}
      >
        {bodyComponent}
      </div>
    )
  }
}

MainViewport.propTypes = {
  html: PropTypes.string.isRequired,
  jsonMlRaw: PropTypes.array.isRequired,

  module: PropTypes.shape({
    jsonMl: PropTypes.array.isRequired
  }).isRequired,

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
