import React, { Component, PropTypes } from 'react'
import Act from 'components/Act'

class CharacterSwimlane extends Component {
  render () {
    return (
      <div>
        <div>
          CharacterSwimlane Header
        </div>
        <Act key={'laughing out loud'} />
        <Act key={'punch in the face'} />
      </div>
    )
  }
}

CharacterSwimlane.PropTypes = {
  key: PropTypes.string.isRequired
}

export default CharacterSwimlane
