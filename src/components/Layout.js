import React, { Component, PropTypes } from 'react'

class Layout extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  onClick (e) {
    this.props.toggleBackpack()
  }
  render () {
    return (
      <div>
        <FloatingActionButton style={{position: 'fixed', right: 20, bottom: 20}} onClick={(this.onClick)}>
          <ActionWork />
        </FloatingActionButton>
      </div>
    )
  }
}

Layout.propTypes = {
  layout: PropTypes.func.isRequired
}

export default Layout                                                                                                                                                     
