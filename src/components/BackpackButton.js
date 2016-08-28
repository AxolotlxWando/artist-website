import React, { Component, PropTypes } from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
// import SvgIcon from 'material-ui/SvgIcon'
// import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionWork from 'material-ui/svg-icons/action/work'

import 'sass/components/backpack-button.scss'

class BackpackButton extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  onClick (e) {
    this.props.toggleBackpack()
  }
  render () {
    return (
      <div className={'BackpackButton'}>
        <FloatingActionButton style={{position: 'fixed', right: 20, bottom: 20}} onClick={() => (this.onClick())}>
          <ActionWork />
        </FloatingActionButton>
      </div>
    )
  }
}

BackpackButton.propTypes = {
  toggleBackpack: PropTypes.func.isRequired
}

export default BackpackButton
