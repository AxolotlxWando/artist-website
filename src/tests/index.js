import React, { Component } from 'react'
import TestUtils from 'react/lib/ReactTestUtils'

import { markdown } from 'markdown'
// import DWModule from 'utils/dwModule'

class TestPage extends Component {
  constructor () {
    super()
    this.update = this.update.bind(this)
  }
  componentDidMount () {
    this.input = document.getElementById('text-input')
    this.preview = document.getElementById('preview')
  }
  update () {
    // console.clear()
    this.preview.innerHTML = markdown.toHTML(this.input.value, 'Maruku')
  }
  render () {
    return (
      <div>
        <div id='root' style={{width: '100%', height: '100%'}}></div>
        <para>
          var div = document.createElement();<br />
          div.setAttribute('id', 'div');<br />
          <br />
          document.getElementById('lab').appendChild(div)<br />
          <br />
          <div id='lab'></div>
        </para>
        <textarea id='text-input' onInput={this.update}
          rows='6' cols='60' defaultValue='Type **Markdown** here.'>
        </textarea>
        <div id='preview'> </div>
      </div>
    )
  }
}

var element = TestUtils.renderIntoDocument(<TestPage />)
