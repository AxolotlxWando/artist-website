import React, { Component } from 'react'

import 'sass/components/main-viewport.scss'

class MainViewport extends Component {
  render () {
    return (
      <div className={'MainViewport'}>
        {this.props.html}
      </div>
    )
  }
}

export default MainViewport
