import React, { Component } from 'react'
import { Link } from 'react-router'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import Backpack from 'container/Backpack'

class App extends Component {
  render () {
    return (
      <div>
        <FloatingActionButton style=
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
