import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'

import { connect } from 'react-redux'

import Backpack from 'containers/Backpack'
import { toggleBackpack } from 'actions/backpackActions'
import BackpackButton from 'components/BackpackButton'

import { fileOpenAsync } from 'actions/tutorialWriterActions'

import 'sass/components/app.scss'

function mapStateToProps (state) {
  return {
    backpack_collapsed: state.backpack.collapsed
  }
}

function mapDispatchToProps (dispatch) {
  return {
    backpack_toggleBackpack: () => {
      dispatch(toggleBackpack())
    },
    openFile: () => {
      dispatch(fileOpenAsync())
    }
  }
}

class App extends Component {
  constructor (props) {
    super(props)
    // Operations usually carried out in componentWillMount go here
    this.props.openFile()
  }
  render () {
    const appContentClasses = classNames(
      'App-Content',
      this.props.backpack_collapsed ? 'App-Content-backpack-is-collapsed' : 'App-Content-backpack-is-expanded'
    )
    return (
      <div className={'App'}>
        <BackpackButton toggleBackpack={this.props.backpack_toggleBackpack} />
        <div className={appContentClasses}>
          <Backpack />
          <Link to='/'>Home</Link>
          <Link to='/writer'>Writer</Link>
          <Link to='/viewer'>Viewer</Link>
          <Link to='/faq'>FAQ</Link>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
