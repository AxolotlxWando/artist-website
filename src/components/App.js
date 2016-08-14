import React, { Component } from 'react'
import { Link } from 'react-router'

import Backpack from 'containers/Backpack'

import 'sass/components/app.scss'

class App extends Component {
  render () {
    return (
      <div className={'wrap'}>
        <Backpack />
        <Link to='/'>Home</Link>
        <Link to='/writer'>Writer</Link>
        <Link to='/viewer'>Viewer</Link>
        <Link to='/faq'>FAQ</Link>
        {this.props.children}
      </div>
    )
  }
}

export default App
