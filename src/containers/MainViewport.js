import React, { Component, PropTypes } from 'react'

import 'github-markdown-css/github-markdown.css'
import 'sass/components/main-viewport.scss'

class MainViewport extends Component {
  render () {
    return (
      <div className={'MainViewport'}>
        <div className={'MainViewport-Paper'}>
          <div className={'markdown-body'}>
            <div dangerouslySetInnerHTML={{__html: this.props.html}} />
          </div>
        </div>
      </div>
    )
  }
}

MainViewport.propTypes = {
  html: PropTypes.string.isRequired
}

export default MainViewport
