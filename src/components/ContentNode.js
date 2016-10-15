// React
import React, { Component, PropTypes } from 'react'

class ContentNode extends Component {
  render () {
    return (
      <div> fill this </div>
    )
  }
}

ContentNode.propTypes = {
  node: PropTypes.array.isRequired
}

export default ContentNode