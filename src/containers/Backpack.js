import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import classNames from 'classnames'
import 'sass/components/backpack.scss'

import 'assets/backpack-background.png'
import 'assets/backpack-content.png'

function mapStateToProps (state) {
  return {
    collapsed: state.backpack.collapsed
  }
}

class Backpack extends Component {
  getStyleString () {
    return (
      'height: 200px;' +
      'width: 200px;' +
      'border: 2px solid #000;' +
      'overflow-x: scroll;'
    )
  }
  render () {
    const classes = classNames({
      Backpack: true,
      [this.props.collapsed ? 'collapsed' : 'expanded']: true
    })
    return (
      <div className={classes}>
        <div className={'BackpackContent'} />
      </div>
    )
  }
}

Backpack.propTypes = {
  collapsed: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(Backpack)
