import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import classNames from 'classnames'
import * as colors from 'material-ui/styles/colors'
import 'sass/components/backpack.scss'

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
      backpack: true,
      collapsed: this.props.collapsed
    })
    return (
      <div>
        <div className={classes}>
            <p>
              Content<br />
              Content<br />
              Content<br />
              Content<br />
            </p>
        </div>
      </div>
    )
  }
}

Backpack.propTypes = {
  collapsed: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(Backpack)
