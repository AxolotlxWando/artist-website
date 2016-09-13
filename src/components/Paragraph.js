import React, { Component } from 'react'

import 'sass/components/paragraph.scss'

class Paragraph extends Component {
  render () {
    return (
      <div className={'Paragraph'}>
        Paragraph {this.props.id}
      </div>
    )
  }
}

export default Paragraph
