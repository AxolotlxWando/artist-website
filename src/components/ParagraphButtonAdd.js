import React, { Component, PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton'

import scrollTo from 'utils/scrollTo'

class ParagraphButtonAdd extends Component {
  constructor (props) {
    super(props)
    this._scrollTo = this._scrollTo.bind(this)
  }
  _scrollTo (end, duration) {
    scrollTo.call(document.getElementById('mainViewport'), 0, 2000)
    console.log('done')
  }
  render () {
    return (
      <div className={'BackpackButton'} onClick={this._scrollTo}>
        <RaisedButton label='Add Paragraph' primary />
      </div>
    )
  }
}

ParagraphButtonAdd.propTypes = {
}

export default ParagraphButtonAdd
