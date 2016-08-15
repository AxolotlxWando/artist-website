import React, { Component } from 'react'
import { Link } from 'react-router'

import { connect } from 'react-redux'
import { toggleBackpack } from 'actions/backpack'

import Backpack from 'containers/Backpack'
import BackpackButton from 'components/BackpackButton'

import 'sass/components/app.scss'

function mapStateToProps (state) {
  return {
    collapsed: state.backpack.collapsed
  }
}

function mapDispatchToProps (dispatch) {
  return {
    toggleBackpack: () => {
      dispatch(toggleBackpack())
    }
  }
}

class App extends Component {
  render () {
    return (
      <div className={'wrap'}>
        <Backpack />
        <BackpackButton toggleBackpack={this.props.toggleBackpack} />
        <Link to='/'>Home</Link>
        <Link to='/writer'>Writer</Link>
        <Link to='/viewer'>Viewer</Link>
        <Link to='/faq'>FAQ</Link>
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
